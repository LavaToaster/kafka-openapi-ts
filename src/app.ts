import "reflect-metadata";
import "source-map-support/register";
import { AppConfig, BaseApp, BaseHttpService } from "../lib";
import { TestTopic } from "./messaging/testTopic";
import { DeepPartial } from "utility-types";

export class App extends BaseApp {
  constructor(config: DeepPartial<AppConfig> = {}) {
    super({
      appName: "test-api",
      ...config,
    });

    this.services.push(new BaseHttpService(this), new TestTopic(this));
  }
}
