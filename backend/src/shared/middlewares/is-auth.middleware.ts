import { GraphqlContext } from '@/graphql/graphql.context';
import { MiddlewareFn } from 'type-graphql';
import { UnauthorizedError } from '../errors/unauthorized.error';

export const IsAuth: MiddlewareFn<GraphqlContext> = async (
  { context },
  next,
) => {
  if (!context.user) throw new UnauthorizedError('Usuário não autenticado');
  return next();
};
