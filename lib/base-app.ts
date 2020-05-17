import { AppConfig, defaultConfig } from "./config";
import { Kafka } from "kafkajs";
import { createLogger, kafkaJsToLogLevel, LogLevel } from "./logger";
import { Logger } from "winston";
import { RunMode, Service } from "./service";
import { merge } from "lodash";

export abstract class BaseApp {
  private static _instance: BaseApp;
  static get instance() {
    return BaseApp._instance;
  }

  readonly config: AppConfig;
  readonly logger: Logger;
  readonly kafka: Kafka;

  private booted = false;

  protected services: Service[] = [];

  constructor(config: Partial<AppConfig> = {}) {
    if (BaseApp._instance) {
      throw new Error(
        "More that one application was attempted to be instantiated"
      );
    }

    BaseApp._instance = this;

    this.config = merge({}, defaultConfig, config);
    this.logger = createLogger(this.config.logLevel, this.config.logFormat);
    this.kafka = new Kafka({
      ...this.config.kafka,
      logCreator: () => {
        return ({ level, log }) => {
          const { namespace, timestamp, message, debug, ...extra } = log;

          this.logger.log({
            level: kafkaJsToLogLevel(level),
            message,
            ...extra,
          });
        };
      },
    });
  }

  public async boot() {
    this.logger.log({
      level: LogLevel.Info,
      message: "Booting BaseApp",
      ...this.config,
    });

    for (let service of this.services) {
      if (!service.boot) {
        continue;
      }

      const name = service.constructor?.name || "Unknown Service";

      this.logger.log({
        level: LogLevel.Info,
        message: `Booting ${name}`,
      });
    }

    // Setup Mongo?

    this.booted = true;
  }

  public async run(mode?: RunMode) {
    for (let service of this.services) {
      const name = service.constructor?.name || "Unknown Service";

      if (!service.run) {
        this.logger.log({
          level: LogLevel.Debug,
          message: `SKipping ${name} - no run`,
        });
        continue;
      }

      // Skip the service if it defines mode, but
      if (service.modes && !service.modes().includes(mode!)) {
        this.logger.log({
          level: LogLevel.Debug,
          message: `Skipping ${name} - "${
            mode || ""
          }" isn't one of "${service.modes().join(",")}"`,
        });

        continue;
      }

      this.logger.log({
        level: LogLevel.Info,
        message: `Starting ${name}`,
      });

      await service.run();
    }

    this.logger.log({
      level: LogLevel.Info,
      message: "Running BaseApp",
    });
  }

  public isBooted() {
    return this.booted;
  }
}
