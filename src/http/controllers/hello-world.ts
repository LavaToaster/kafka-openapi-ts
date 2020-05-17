import { Get, JsonController, Param, QueryParam } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { IsString } from "class-validator";
import { Test } from "../../domain/models/test";

class HelloWorldResponse {
  @IsString() message!: string;
}

@JsonController()
export class HelloWorldController {
  @Get("/")
  @OpenAPI({ summary: "Return a nice message :)" })
  @ResponseSchema(HelloWorldResponse)
  public async index() {
    return {
      message: "Hello World",
    };
  }

  @Get("/test/:id")
  @OpenAPI({ summary: "Return a nice message :)" })
  @ResponseSchema(Test)
  public async test(
    @Param("id") id: string,
    @QueryParam("number") num?: number
  ) {
    return {
      id: id,
    };
  }
}
