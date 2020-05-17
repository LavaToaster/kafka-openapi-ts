import "reflect-metadata";
import "source-map-support/register";
import { AppConfig, BaseApp } from "../lib";
import { TestTopic } from "./messaging/test-topic";
import { HttpKernel } from "./http/http-kernel";

export class App extends BaseApp {
  constructor(config: Partial<AppConfig> = {}) {
    super({
      appName: "test-api",
      ...config,
    });

    this.services.push(new HttpKernel(this), new TestTopic(this));
  }
}
