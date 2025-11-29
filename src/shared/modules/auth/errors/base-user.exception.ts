export class BaseUserException extends Error {
  constructor(
    public httpStatusCode: number,
    message: string
  ) {
    super(message);
  }
}
