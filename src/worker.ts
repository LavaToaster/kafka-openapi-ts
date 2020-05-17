import { App } from "./app";
import { RunMode } from "../lib";

async function main() {
  const app = new App();

  await app.boot();
  await app.run(RunMode.Worker);
}

main().catch((err) => {
  console.error("Cannot start the application.", err);
  process.exit(1);
});
