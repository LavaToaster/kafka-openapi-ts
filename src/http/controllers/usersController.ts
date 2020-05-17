import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
} from "tsoa";
import { User } from "../../domain/user";
import { UserCreationParams, UsersService } from "../../domain/userService";

@Route("users")
export class UsersController extends Controller {
  private service: UsersService;

  constructor() {
    super();
    this.service = new UsersService();
  }

  @Get("{userId}")
  public async getUser(@Path() userId: string): Promise<User | null> {
    return this.service.get(userId);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<User> {
    this.setStatus(201); // set return status 201
    return this.service.create(requestBody);
  }
}
