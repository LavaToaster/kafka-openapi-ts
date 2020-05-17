import { Consumer, EachMessagePayload } from "kafkajs";
import { App } from "../app";
import { RunMode, Service } from "../../lib";

export class TestTopic implements Service {
  private app: App;
  private consumer: Consumer;

  constructor(app: App) {
    this.app = app;
    this.consumer = app.kafka.consumer({
      groupId: "test-topic-consumer",
    });
  }

  public modes(): RunMode[] {
    return [RunMode.Worker];
  }

  public async run() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: "test-topic" });
    await this.consumer.run({ eachMessage: this.testTopicListener });
  }

  private async testTopicListener({
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
  }
}
