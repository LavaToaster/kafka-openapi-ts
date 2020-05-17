import { BaseApp } from "../baseApp";
import { LogLevel } from "../logger";

export interface EventPayload<N, P> {
  eventId: string;
  aggregateId: string;
  eventName: N;
  payload: P;
  userId?: string;
  occurredOn: string;
  deleted?: boolean;
}

export function HandleEvent(eventName: string) {
  return (target: BaseEntity<any, any>, propertyKey: string) => {
    const object: any = target.constructor;

    if (!object.eventMapping) {
      object.eventMapping = {};
    }

    if (object.eventMapping[eventName]) {
      console.error(
        `Received duplicated event mapping on ${object.name} for event "${eventName}"`
      );
      process.exit(1);
    }

    object.eventMapping[eventName] = propertyKey;
  };
}

export class BaseEntity<D, P extends EventPayload<any, any>> {
  #app: BaseApp;
  #events: P[] = [];

  constructor(events?: P[]) {
    this.#app = BaseApp.instance;

    for (let event of events || []) {
      this.apply(event);
    }
  }

  public get events() {
    return this.#events;
  }

  public apply(event: P) {
    // @ts-ignore
    const eventMapping = this.constructor.eventMapping ?? {};
    const functionName = eventMapping[event.eventName];

    if (!functionName) {
      this.#app.logger.log({
        level: LogLevel.Error,
        message: `Unknown event "${event.eventName}" received`,
        ...event,
      });

      return this;
    }

    // @ts-ignore
    this[functionName](event);

    this.#events.push(event);

    return this;
  }
}
