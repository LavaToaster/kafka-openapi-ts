import { BaseApp } from "../baseApp";
import { Collection, MongoClient } from "mongodb";
import { snakeCase, omit } from "lodash";
import { plural } from "pluralize";
import { EntityNotFoundError } from "../errors/errors";

export class CrudRepository<D extends { [key: string]: any } = any> {
  protected readonly mongo: MongoClient;
  protected readonly entityName: string;
  protected readonly collection: Collection<D>;

  constructor() {
    this.mongo = BaseApp.instance.mongo;
    this.entityName = this.constructor.name.slice(0, -10);
    const collectionName = snakeCase(plural(this.entityName));

    this.collection = this.mongo.db().collection(collectionName);
  }

  public async findById(id: string) {
    const result = this.collection.findOne({ _id: id } as any);

    if (!result) {
      throw new EntityNotFoundError(this.entityName);
    }

    return result;
  }

  public async insertOne(document: D) {
    return this.collection.insertOne({
      _id: document.id,
      ...omit(document, "id"),
    } as any);
  }

  public async updateOne(document: Partial<D>) {
    return this.collection.updateOne(
      {
        _id: document.id,
      } as any,
      omit(document, "id")
    );
  }

  public async deleteById(id: string) {
    return this.collection.deleteOne({ _id: id } as any);
  }
}
