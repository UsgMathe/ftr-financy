import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import express from 'express';
import { buildSchema } from 'type-graphql';

import cors from 'cors';
import { buildContext } from './graphql/graphql.context';
import { AuthResolver } from './modules/auth/auth.resolver';
import { UserResolver } from './modules/user/user.resolver';
import { errorHandler } from './shared/middlewares/error-handler.middleware';
import { env } from './shared/utils/env.utils';

async function main() {
  const app = express();

  app.use(errorHandler);
  app.use(cookieParser());

  const schema = await buildSchema({
    resolvers: [UserResolver, AuthResolver],
    validate: false,
    emitSchemaFile: './schema.graphql',
  });

  const server = new ApolloServer({ schema });

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
