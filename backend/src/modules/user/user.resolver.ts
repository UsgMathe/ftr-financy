import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql';

import { IsAuth } from '@/shared/middlewares/is-auth.middleware';
import { UserModel } from '../auth/models/user.model';
import { UserService } from './user.service';

@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
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
}
