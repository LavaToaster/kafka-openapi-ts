import { BaseApp } from "../baseApp";
import { Collection, MongoClient } from "mongodb";
import { snakeCase } from "lodash";
import { plural } from "pluralize";
import { BaseEntity } from "./baseEntity";

type ExtractDocument<T> = T extends BaseEntity<infer D, any> ? D : never;
type ExtractPayload<T> = T extends BaseEntity<any, infer P> ? P : never;

export function EventRepository<
  E extends BaseEntity<any, any>,
  D = ExtractDocument<E>,
  P = ExtractPayload<E>,
  >(entityCreator: (events?: P[]) => E) {
  return class EventRepository {
    mongo: MongoClient;
    collection: Collection<P>;

    constructor() {
      this.mongo = BaseApp.instance.mongo;
      const collectionName = snakeCase(
        plural(this.constructor.name.slice(0, -15))
      ) + '_events';

      this.collection = this.mongo.db().collection(collectionName);
    }

    public async append(events: P[]) {
      return this.collection.insertMany(events as any)
    }

    public async findById(aggregateId: string) {
      const events = await this.collection.find({ aggregateId } as any);
      const entity = entityCreator();

      for await (const event of events) {
        entity.apply(event);
      }

      return entity;
    }
  }
}
