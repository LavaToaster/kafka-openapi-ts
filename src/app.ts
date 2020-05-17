import "reflect-metadata";
import "source-map-support/register";
import { AppConfig, BaseApp, BaseHttpService } from "../lib";
import { UsersTopic } from "./messaging/usersTopic";
import { DeepPartial } from "utility-types";

export class App extends BaseApp {
  constructor(config: DeepPartial<AppConfig> = {}) {
    super({
      appName: "test-api",
      ...config,
    });

    this.serviceCreators.push(() => new BaseHttpService(this), () => new UsersTopic(this));
  }
}
