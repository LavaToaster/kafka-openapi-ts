import { IsString } from "class-validator";

export class Test {
  @IsString() id!: String;
}
