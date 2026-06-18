import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { buildSchema } from 'type-graphql';

import { buildContext, GraphqlContext } from './graphql/graphql.context';
import { AuthResolver } from './modules/auth/auth.resolver';
import { CategoryResolver } from './modules/category/category.resolver';
import { TransactionResolver } from './modules/transaction/transaction.resolver';
import { UserResolver } from './modules/user/user.resolver';
import { UnauthorizedError } from './shared/errors/unauthorized.error';
import { errorHandler } from './shared/middlewares/error-handler.middleware';
import { env } from './shared/utils/env.utils';

async function main() {
  const app = express();

  app.use(errorHandler);
  app.use(cookieParser());

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      AuthResolver,
      CategoryResolver,
      TransactionResolver,
    ],
    validate: {
      forbidUnknownValues: false,
      validationError: {
        target: false,
        value: false,
      },
    },
    emitSchemaFile: './schema.graphql',
    authChecker: ({ context }: { context: GraphqlContext }) => {
      if (!context.user) {
        throw new UnauthorizedError('Usuário não autenticado!');
      }

      return true;
    },
  });

  const server = new ApolloServer({
    schema,
    introspection: env.NODE_ENV === 'development',
    includeStacktraceInErrorResponses: env.NODE_ENV === 'development',
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
