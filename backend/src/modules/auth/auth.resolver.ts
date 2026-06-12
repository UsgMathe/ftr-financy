import { GraphqlContext } from '@/graphql/graphql.context';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { AuthService } from './auth.service';
import { SigninInput, SigninOutput } from './dtos/signin.dto';
import { SignupInput, SignupOutput } from './dtos/signup.dto';

@Resolver()
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => SignupOutput)
  async signup(@Arg('data', () => SignupInput) data: SignupInput) {
    return this.authService.signup(data);
  }

  @Mutation(() => SigninOutput)
  async signin(
    @Arg('data', () => SigninInput) data: SigninInput,
    @Ctx() ctx: GraphqlContext,
  ) {
    return this.authService.signin(data, ctx);
  }

  @Mutation(() => Boolean)
  async signout(@Ctx() ctx: GraphqlContext) {
    return this.authService.signout(ctx.res);
  }
}
