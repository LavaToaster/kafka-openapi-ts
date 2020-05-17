export enum RunMode {
  Http = "http",
  Worker = "worker",
}

export interface Service {
  boot?(): Promise<void>;
  // TODO: This should be moved to a decorator, so we can skip instantiating it to find out its modes.
  modes?(): RunMode[];
  run?(): Promise<void>;
}
