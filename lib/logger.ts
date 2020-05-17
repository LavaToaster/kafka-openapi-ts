import winston from "winston";
import { logLevel as KafkaLogLevel } from "kafkajs";

export enum LogLevel {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
}

export function createLogger(
  level: LogLevel,
  format: "json" | "pretty" = "json"
) {
  const logFormatters = [
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.json(),
  ];

  if (format === "pretty") {
    logFormatters.pop();

    logFormatters.push(
      winston.format.colorize(),
      winston.format.align(),
      winston.format.simple()
    );
  }

  return winston.createLogger({
    level: level,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(...logFormatters),
        handleExceptions: true,
      }),
    ],
  });
}

export function kafkaJsToLogLevel(level: KafkaLogLevel): LogLevel {
  switch (level) {
    case KafkaLogLevel.ERROR:
    case KafkaLogLevel.NOTHING:
      return LogLevel.Error;
    case KafkaLogLevel.WARN:
      return LogLevel.Warn;
    case KafkaLogLevel.INFO:
      return LogLevel.Info;
    case KafkaLogLevel.DEBUG:
      return LogLevel.Debug;
  }
}

export function logLevelToKafkaJs(level: LogLevel): KafkaLogLevel {
  switch (level) {
    case LogLevel.Error:
      return KafkaLogLevel.ERROR;
    case LogLevel.Warn:
      return KafkaLogLevel.WARN;
    case LogLevel.Info:
      return KafkaLogLevel.INFO;
    case LogLevel.Debug:
      return KafkaLogLevel.DEBUG;
  }
}
