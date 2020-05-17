import { BaseEntity, EventPayload, HandleEvent } from "../../lib";

export enum Status {
  Happy = "Happy",
  Sad = "Sad",
}

export interface User {
  id: string;
  email: string;
  name: string;
  status?: Status;
  phoneNumbers: string[];
}

type UserWithoutId = Omit<User, "id">;

export enum UserEvents {
  UserCreated = "UserCreated",
  UserUpdated = "UserUpdated",
}

export type UserCreatedEvent = EventPayload<
  UserEvents.UserCreated,
  UserWithoutId
>;
export type UserUpdatedEvent = EventPayload<
  UserEvents.UserUpdated,
  Partial<UserWithoutId>
>;

export type UserEventPayloads = UserCreatedEvent | UserUpdatedEvent;

export class UserEntity extends BaseEntity<User, UserEventPayloads>
  implements User {
  public id: string = "";
  public email: string = "";
  public name: string = "";
  public phoneNumbers: string[] = [];
  public status?: Status;

  @HandleEvent(UserEvents.UserCreated)
  public applyUserCreated(event: UserCreatedEvent) {
    this.id = event.aggregateId;
    this.email = event.payload.email;
    this.name = event.payload.name;
    this.phoneNumbers = event.payload.phoneNumbers;
    this.status = event.payload.status;
  }

  @HandleEvent(UserEvents.UserUpdated)
  public applyUserUpdated(event: UserUpdatedEvent) {
    if (event.payload.email) {
      this.email = event.payload.email;
    }

    if (event.payload.name) {
      this.name = event.payload.name;
    }

    if (event.payload.phoneNumbers) {
      this.phoneNumbers = event.payload.phoneNumbers;
    }

    if (event.payload.status) {
      this.status = event.payload.status;
    }
  }
}
