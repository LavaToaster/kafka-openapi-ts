import { Consumer, EachMessagePayload } from "kafkajs";
import { App } from "../app";
import { RunMode, Service } from "../../lib";
import { UserEventPayloads, UserEvents } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

export class UsersTopic implements Service {
  private app: App;
  private consumer: Consumer;
  private repository: UserRepository;

  constructor(app: App) {
    this.app = app;
    this.consumer = app.kafka.consumer({
      groupId: "users-topic-consumer",
    });
    this.repository = new UserRepository();
  }

  public modes(): RunMode[] {
    return [RunMode.Worker];
  }

  public async run() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: "users", fromBeginning: true });
    await this.consumer.run({
      eachMessage: this.listenForEvents.bind(this),
    });
  }

  private async listenForEvents({
    topic,
    partition,
    message,
  }: EachMessagePayload) {
    this.app.logger.log({
      level: "info",
      message: `Incoming Payload (${topic})`,
      partition,
      offset: message.offset,
      value: message.value.toString(),
    });

    const event: UserEventPayloads = JSON.parse(message.value.toString());

    switch (event.eventName) {
      case UserEvents.UserCreated:
        this.app.logger.log({
          level: "info",
          message: `Creating user ${event.aggregateId}`,
        });

        await this.repository.insertOne({
          id: event.aggregateId,
          ...event.payload,
        });
        break;
      case UserEvents.UserUpdated:
        this.app.logger.log({
          level: "info",
          message: `Updating user ${event.aggregateId}`,
        });

        await this.repository.updateOne(event.payload);
        break;
    }
  }
}
