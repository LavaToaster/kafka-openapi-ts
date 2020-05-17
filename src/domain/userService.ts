import { Status, User, UserCreatedEvent, UserEntity, UserEvents } from "./user";
import { v4 } from "uuid";
import { BaseApp } from "../../lib";
import { Producer } from "kafkajs";
import { UserEventRepository } from "./userRepository";

// A post request should not contain an id.
export interface UserCreationParams extends Omit<User, "id"> {}

export class UsersService {
  private producer: Producer;
  private eventRepository: UserEventRepository;

  constructor() {
    this.producer = BaseApp.instance.kafka.producer();
    this.eventRepository = new UserEventRepository();
  }


  public async get(id: string) {
    return this.eventRepository.findById(id);
  }

  public async create(userCreationParams: UserCreationParams) {
    const event: UserCreatedEvent = {
      eventName: UserEvents.UserCreated,
      aggregateId: v4(),
      eventId: v4(),
      payload: userCreationParams,
      occurredOn: new Date().toISOString(),
    };

    await this.eventRepository.append([event]);
    await this.producer.send({
      topic: 'users',
      messages: [
        {
          value: JSON.stringify(event),
        }
      ],
    });

    return new UserEntity([event]);
  }
}
