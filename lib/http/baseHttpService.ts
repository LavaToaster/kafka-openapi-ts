import { RunMode, Service } from "../service";
import Koa from "koa";
import { BaseApp } from "../baseApp";
import { LogLevel } from "../logger";
import Router from "@koa/router";
import bodyparser from "koa-bodyparser";
import cors from "@koa/cors";
import koaSwagger from "koa2-swagger-ui";
import koaHelmet from "koa-helmet";

export class BaseHttpService implements Service {
  protected app: BaseApp;
  protected http: Koa;
  protected router: Router;

  constructor(app: BaseApp) {
    this.app = app;
    this.router = new Router();
    this.http = new Koa();
  }

  public modes() {
    return [RunMode.Http];
  }

  protected configureMiddleware() {
    this.app.config.http.registerRoutes!(this.router);
    this.router.get("/openapi.json", (ctx) => {
      ctx.body = this.app.config.http.openApiSpec;
    });

    this.http.use(
      koaSwagger({
        routePrefix: "/explorer", // host at /swagger instead of default /docs
        swaggerOptions: {
          url: "/openapi.json", // example path to json
        },
      })
    );

    this.http.use(this.errorHandler)
    this.http.use(bodyparser());
    this.http.use(cors());
    this.http.use(this.router.routes());
    this.http.use(this.router.allowedMethods());
    this.http.use(koaHelmet());
  }

  public async run() {
    if (!this.app.config.http.registerRoutes) {
      this.app.logger.log({
        level: LogLevel.Error,
        message:
          "Http server tried to run without `http.registerRoutes` config option defined",
      });

      process.exit(1);
    }

    this.configureMiddleware();

    const host = this.app.config.http.host;
    const port = this.app.config.http.port;

    await this.http.listen(port, host);

    this.app.logger.log({
      level: LogLevel.Info,
      message: `Http server started on ${host}:${port}`,
    });
  }

  public async errorHandler(ctx: Koa.Context, next: Koa.Next) {
    try {
      await next();
    } catch (error) {

      if (error.httpStatus) {
        ctx.status = error.httpStatus;
      }

      // TODO: Expand this out a bit more, add better information
      //  if the error has it
      ctx.body = {
        error: {
          message: error.message
        },
      };
    }
  }
}
