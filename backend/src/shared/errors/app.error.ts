import { GraphQLError } from 'graphql';

export class AppError extends GraphQLError {
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
  }
}
