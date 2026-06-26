import { GraphQLError } from 'graphql';

export class AppError extends GraphQLError {
  public statusCode: number;
  public code: string;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    extensions?: Record<string, unknown>,
  ) {
    super(message, {
      extensions: {
        code,
        statusCode,
        details: [],
        ...extensions,
      },
    });

    this.code = code;
    this.statusCode = statusCode;
  }
}
