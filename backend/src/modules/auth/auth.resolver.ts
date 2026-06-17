import { GraphqlContext } from '@/graphql/graphql.context';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { AuthService } from './auth.service';
import { SigninInput, SigninOutput } from './dtos/signin.dto';
import { SignupInput } from './dtos/signup.dto';
import { UserModel } from './models/user.model';

@Resolver()
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => UserModel, { description: 'Criar conta' })
  async signup(@Arg('data', () => SignupInput) data: SignupInput) {
    return this.authService.signup(data);
  }

  @Mutation(() => SigninOutput, { description: 'Fazer login' })
  async signin(
    @Arg('data', () => SigninInput) data: SigninInput,
    @Ctx() ctx: GraphqlContext,
  ) {
    return this.authService.signin(data, ctx);
  }

  @Mutation(() => Boolean, { description: 'Fazer logout' })
  async signout(@Ctx() ctx: GraphqlContext) {
    return this.authService.signout(ctx.res);
  }
}
