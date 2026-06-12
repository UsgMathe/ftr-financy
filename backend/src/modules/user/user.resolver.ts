import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { User } from '@/generated/prisma/browser';
import { GqlUser } from '@/graphql/decorators/user.decorator';
import { UserModel } from '../auth/models/user.model';
import { CreateUserInput } from './dtos/create-user.dto';
import { UpdateUserInput } from './dtos/update-user.dto';
import { UserService } from './user.service';

@Resolver(() => UserModel)
export class UserResolver {
  private userService = new UserService();

  @Mutation(() => UserModel)
  async createUser(@Arg('data', () => CreateUserInput) data: CreateUserInput) {
    return this.userService.createUser(data);
  }

  @Mutation(() => Boolean)
  async deleteUser(@GqlUser() user: User) {
    return this.userService.deleteUser(user.id);
  }

  @Mutation(() => UserModel)
  async updateUser(
    @Arg('data', () => UpdateUserInput) data: UpdateUserInput,
    @GqlUser() user: User,
  ) {
    return this.userService.updateUser(user, data);
  }

  @Query(() => UserModel)
  async getUser(@GqlUser() user: User) {
    return this.userService.findUser(user.id);
  }

  @Query(() => [UserModel])
  async listUsers() {
    return this.userService.listUsers();
  }
}
