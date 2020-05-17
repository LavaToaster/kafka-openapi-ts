import { App } from "./app";
import { RunMode } from "../lib";
import { RegisterRoutes } from "./http/routes.gen";

async function main() {
  // This is in a variable because it prevents TS from trying to
  //  locate and get types info.
  const swaggerFile = "./swagger.json";
  const app = new App({
    http: {
      registerRoutes: RegisterRoutes,
      openApiSpec: await import(swaggerFile),
    },
  });

  await app.boot();
  await app.run(RunMode.Http);
}

main().catch((err) => {
  console.error("Cannot start the application.", err);
  process.exit(1);
});
