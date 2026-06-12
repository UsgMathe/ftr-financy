import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { buildSchema } from 'type-graphql';

import { formatGraphqlError } from './graphql/format-graphql-error';
import { buildContext, GraphqlContext } from './graphql/graphql.context';
import { AuthResolver } from './modules/auth/auth.resolver';
import { UserResolver } from './modules/user/user.resolver';
import { ForbiddenError } from './shared/errors/forbidden.error';
import { UnauthorizedError } from './shared/errors/unauthorized.error';
import { errorHandler } from './shared/middlewares/error-handler.middleware';
import { env } from './shared/utils/env.utils';

async function main() {
  const app = express();

  app.use(errorHandler);
  app.use(cookieParser());

  const schema = await buildSchema({
    resolvers: [UserResolver, AuthResolver],
    validate: {
      forbidUnknownValues: false,
      validationError: {
        target: false,
        value: false,
      },
    },
    emitSchemaFile: './schema.graphql',
    authChecker: (
      { context }: { context: GraphqlContext },
      roles: string[],
    ) => {
      if (!context.user) {
        throw new UnauthorizedError('Usuário não autenticado!');
      }

      if (roles.length === 0) {
        return true;
      }

      if (!roles.includes(context.role || '')) {
        throw new ForbiddenError(
          'Você não tem permissão para realizar esta ação!',
        );
      }

      return true;
    },
  });

  const server = new ApolloServer({
    schema,
    introspection: env.NODE_ENV === 'development',
    includeStacktraceInErrorResponses: env.NODE_ENV === 'development',
    formatError: formatGraphqlError,
  });

  await server.start();

  app.use(
    '/graphql',
    cors({
      origin: process.env.CLIENT_URL!,
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, { context: buildContext }),
  );

  app.listen(env.PORT, () => {
    console.log(`🚀 Server ready at: http://localhost:${env.PORT}/graphql`);
  });
}

main();
