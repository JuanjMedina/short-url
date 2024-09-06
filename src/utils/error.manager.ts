import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager extends Error {
  constructor({
    type,
    message,
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    super(`${type} :: ${message}`);
  }
  public static createSignatureError(message: string) {
    const [Status, Message] = message.split(' :: ');
    if (Message) {
      throw new HttpException(Message, HttpStatus[Status]);
    }
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
