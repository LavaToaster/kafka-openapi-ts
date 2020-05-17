import { RunMode, Service } from "../service";
import Koa from "koa";
import { BaseApp } from "../base-app";
import { LogLevel } from "../logger";
import {
  createServer,
  KoaDriver,
  getMetadataArgsStorage,
  RoutingControllersOptions,
} from "routing-controllers";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { routingControllersToSpec } from "routing-controllers-openapi";
import Router from "koa-router";
import koaSwagger from "koa2-swagger-ui";

export abstract class BaseHttpKernel implements Service {
  protected app: BaseApp;
  protected http: Koa;
  protected router: Router;

  constructor(app: BaseApp) {
    this.app = app;
    this.router = new Router();
    this.http = createServer(
      new KoaDriver(undefined, this.router),
      this.options()
    );
  }

  private options(): RoutingControllersOptions {
    return {
      ...this.config,
    };
  }

  public modes() {
    return [RunMode.Http];
  }

  public abstract config(): RoutingControllersOptions;

  public async run() {
    // Parse class-validator classes into JSON Schema:
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: "#/components/schemas/",
    });

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, this.options(), {
      info: {
        title: this.app.config.appName,
        description: `API Documentation for ${this.app.config.appName}`,
        version: "1.0.0",
      },
      components: {
        schemas,
        securitySchemes: {
          basicAuth: {
            scheme: "basic",
            type: "http",
          },
        },
      },
    });

    this.router.get("/openapi.json", (ctx) => {
      ctx.body = spec;
    });

    this.http.use(
      koaSwagger({
        routePrefix: "/explorer", // host at /swagger instead of default /docs
        swaggerOptions: {
          url: "/openapi.json", // example path to json
        },
      })
    );

    const host = this.app.config.http.host;
    const port = this.app.config.http.port;

    await this.http.listen(port, host);

    this.app.logger.log({
      level: LogLevel.Info,
      message: `Http server started on ${host}:${port}`,
    });
  }
}
