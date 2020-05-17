import "reflect-metadata";
import "source-map-support/register";
import { AppConfig, BaseApp, BaseHttpKernel } from "../lib";
import { TestTopic } from "./messaging/test-topic";
import { DeepPartial } from "utility-types";

export class App extends BaseApp {
  constructor(config: DeepPartial<AppConfig> = {}) {
    super({
      appName: "test-api",
      ...config,
    });

    this.services.push(new BaseHttpKernel(this), new TestTopic(this));
  }
}
