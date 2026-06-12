import { unwrapResolverError } from '@apollo/server/errors';
import { GraphQLFormattedError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';

import { AppError } from '@/shared/errors/app.error';
import { ValidationError } from 'class-validator';

export function formatGraphqlError(
  _: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const originalError = unwrapResolverError(error);

  if (originalError instanceof ArgumentValidationError) {
    const validationErrors = originalError.extensions
      .validationErrors as ValidationError[];

    return {
      message: 'Erro de validação',
      extensions: {
        code: 'BAD_USER_INPUT',
        statusCode: 400,
        details: validationErrors.map(err => ({
          field: err.property,
          messages: Object.values(err.constraints ?? {}),
        })),
      },
    };
  }

  if (originalError instanceof AppError) {
    return {
      message: originalError.message,
      extensions: originalError.extensions,
    };
  }

  console.error(originalError);

  return {
    message: 'Erro interno do servidor',
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      details: [],
    },
  };
}
