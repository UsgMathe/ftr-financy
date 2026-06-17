import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';

import { User } from '@/generated/prisma/browser';
import { GqlUser } from '@/graphql/decorators/user.decorator';
import { IsAuth } from '@/shared/middlewares/is-auth.middleware';
import { UserModel } from '../auth/models/user.model';
import { UpdateUserInput } from './dtos/update-user.dto';
import { UserService } from './user.service';

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
  private readonly userService = new UserService();

  @Mutation(() => UserModel, { description: 'Atualizar dados do usuário' })
  async updateUser(
    @Arg('data', () => UpdateUserInput) data: UpdateUserInput,
    @GqlUser() user: User,
  ) {
    return this.userService.updateUser(user.id, data);
  }

  @Query(() => UserModel, { description: 'Buscar perfil do usuário' })
  async getUser(@GqlUser() user: User) {
    return this.userService.findUser(user.id);
  }
}
