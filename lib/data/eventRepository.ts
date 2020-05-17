import { BaseApp } from "../baseApp";
import { Collection, MongoClient } from "mongodb";
import { snakeCase } from "lodash";
import { plural } from "pluralize";
import { BaseEntity } from "./baseEntity";
import { EntityNotFoundError } from "../errors/errors";

type ExtractDocument<T> = T extends BaseEntity<infer D, any> ? D : never;
type ExtractPayload<T> = T extends BaseEntity<any, infer P> ? P : never;

export function EventRepository<
  E extends BaseEntity<any, any>,
  D = ExtractDocument<E>,
  P = ExtractPayload<E>
>(entityCreator: (events?: P[]) => E) {
  return class EventRepository {
    mongo: MongoClient;
    entityName: string;
    collection: Collection<P>;

    constructor() {
      this.mongo = BaseApp.instance.mongo;
      this.entityName = this.constructor.name.slice(0, -15);
      const collectionName = snakeCase(plural(this.entityName)) + "_events";

      this.collection = this.mongo.db().collection(collectionName);
    }

    public async append(events: P[]) {
      return this.collection.insertMany(events as any);
    }

    public async findById(aggregateId: string) {
      const events = await this.collection.find({ aggregateId } as any);

      if (!(await events.hasNext())) {
        throw new EntityNotFoundError(this.entityName);
      }

      const entity = entityCreator();

      for await (const event of events) {
        entity.apply(event);
      }

      if (entity.events.length == 0) {
        return null;
      }

      return entity;
    }
  };
}
