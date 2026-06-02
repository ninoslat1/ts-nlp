export class EntityNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntityNotFoundError";
  }
}

export class EntityRelationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntityRelationError";
  }
}

export class DateFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DateFormatError";
  }
}

export class AmbiguousEntityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AmbiguousEntityError";
  }
}
