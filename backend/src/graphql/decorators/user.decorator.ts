import { createParameterDecorator, ResolverData } from 'type-graphql';

import { User } from '@/generated/prisma/browser';
import { prismaClient } from '@/prisma/prisma.client';
import { GraphqlContext } from '../graphql.context';

export const GqlUser = () => {
  return createParameterDecorator(
    async ({
      context,
      ...all
    }: ResolverData<GraphqlContext>): Promise<User | null> => {
      console.log({ context, all });
      if (!context || !context.user)
        throw new Error('Usuário não encontrado 1');

      try {
        const user = await prismaClient.user.findUnique({
          where: {
            id: context.user,
          },
        });

        if (!user) throw new Error('Usuário não encontrado 2');

        return user;
      } catch (error) {
        console.log(`Error during instancing gqluser decorator: ${error}`);
      }

      return null;
    },
  );
};
