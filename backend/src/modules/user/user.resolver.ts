import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';

import { UserModel } from '../auth/models/user.model';
import { UserService } from './user.service';

@Resolver(() => UserModel)
@Authorized('ADMIN')
export class UserResolver {
  private userService = new UserService();

  @Query(() => UserModel)
  async getUser(@Arg('id', () => String) id: string) {
    return this.userService.findUser(id);
  }

  @Query(() => [UserModel])
  async listUsers() {
    return this.userService.listUsers();
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => String) id: string) {
    return this.userService.deleteUser(id);
  }
}
