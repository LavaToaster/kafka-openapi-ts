export class EntityError extends Error {
  public name: string;

  constructor(name: string, message: string) {
    super(message);

    this.name = name;
  }
}

export class EntityNotFoundError extends EntityError {
  public httpStatus: number;

  constructor(name: string, message?: string) {
    if (!message) {
      message = `${name} not found`;
    }

    super(name, message);

    this.httpStatus = 404;
  }
}
