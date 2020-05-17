export enum RunMode {
  Http = "http",
  Worker = "worker",
}

export interface Service {
  boot?(): Promise<void>;
  modes?(): RunMode[];
  run?(): Promise<void>;
}
