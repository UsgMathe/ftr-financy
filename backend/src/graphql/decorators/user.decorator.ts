import { createParameterDecorator, ResolverData } from 'type-graphql';

import { User } from '@/generated/prisma/client';
import { prismaClient } from '@/prisma/prisma.client';
import { UnauthorizedError } from '@/shared/errors/unauthorized.error';
import { GraphqlContext } from '../graphql.context';

export const GqlUser = () => {
  return createParameterDecorator(
    async ({ context }: ResolverData<GraphqlContext>): Promise<User> => {
      if (!context?.user) throw new UnauthorizedError();

      const user = await prismaClient.user.findUnique({
        where: { id: context.user },
      });

      if (!user) throw new UnauthorizedError();

      return user;
    },
  );
};
