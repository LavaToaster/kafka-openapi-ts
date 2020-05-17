import { BaseHttpKernel } from "../../lib";
import { HelloWorldController } from "./controllers/hello-world";
import { RoutingControllersOptions } from "routing-controllers";

export class HttpKernel extends BaseHttpKernel {
  public config(): RoutingControllersOptions {
    return {
      cors: true,
      controllers: [HelloWorldController],
    };
  }
}
