import "dotenv-flow/config";
import { LogLevel, logLevelToKafkaJs } from "./logger";
import type Router from "@koa/router";
import type { KafkaConfig } from "kafkajs";
import type { Options as KoaCorsOptions } from "@koa/cors";
import type bodyParser from "koa-bodyparser";
import type { IHelmetConfiguration } from "helmet";

export type LogFormat = "json" | "pretty";

export interface AppConfig {
  appName: string;
  logLevel: LogLevel;
  logFormat: LogFormat;
  kafka: KafkaConfig;
  http: {
    host: string;
    port: number;
    registerRoutes?(router: Router): void;
    openApiSpec?: any;

    middleware?: {
      cors?: KoaCorsOptions,
      bodyParser?: bodyParser.Options,
      helmet?: IHelmetConfiguration,
    }
  };
}

const logLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ?? LogLevel.Error;

export const defaultConfig: AppConfig = {
  appName: "<< change app name >>",
  logLevel,
  logFormat: (process.env.LOG_FORMAT as LogFormat) ?? "json",
  http: {
    host: process.env.HOST ?? "0.0.0.0",
    port: parseInt(process.env.PORT ?? "8080"),
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: (process.env.KAFKA_BROKERS || "").split(","),
    logLevel: logLevelToKafkaJs(logLevel),
  },
};
