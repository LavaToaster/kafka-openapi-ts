import { User, UserEntity } from "./user";
import { CrudRepository } from "../../lib";
import { EventRepository } from "../../lib/data/eventRepository";

export class UserRepository extends CrudRepository<User> {}

export class UserEventRepository extends EventRepository<UserEntity>((events) => new UserEntity(events)) {

}
