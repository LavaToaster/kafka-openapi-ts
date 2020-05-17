import { BaseEntity, EventPayload, HandleEvent } from "../../lib";
import { merge } from 'lodash';

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

export type UserCreatedEvent = EventPayload<UserEvents.UserCreated, UserWithoutId>;
export type UserUpdatedEvent = EventPayload<
  UserEvents.UserUpdated,
  Partial<UserWithoutId>
>;

export type UserEventPayloads = UserCreatedEvent | UserUpdatedEvent;

export class UserEntity extends BaseEntity<User, UserEventPayloads> {
  @HandleEvent(UserEvents.UserCreated)
  public applyUserCreated(event: UserCreatedEvent) {
    this._data = {
      id: event.aggregateId,
      ...event.payload,
    };
  }

  @HandleEvent(UserEvents.UserUpdated)
  public applyUserUpdated(event: UserUpdatedEvent) {
    this._data = merge({}, this.data!, event.payload);
  }
}
