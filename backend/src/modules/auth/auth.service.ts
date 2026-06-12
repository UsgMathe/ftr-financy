import { Request, Response } from 'express';

import { AUTH_COOKIE_OPTIONS } from '@/constants/cookies.constants';
import { User } from '@/generated/prisma/browser';
import { GraphqlContext } from '@/graphql/graphql.context';
import { UnauthorizedError } from '@/shared/errors/unauthorized.error';
import { setAuthCookies } from '@/shared/utils/cookies.utils';
import { comparePassword } from '@/shared/utils/hash.utils';
import { jwtSign, verifyJwt } from '@/shared/utils/jwt.utils';

import { UserService } from '../user/user.service';
import { SigninInput } from './dtos/signin.dto';
import { SignupInput, SignupOutput } from './dtos/signup.dto';

export class AuthService {
  private readonly userService = new UserService();

  async signup(data: SignupInput): Promise<SignupOutput> {
    const user = await this.userService.createUser(data);

    return this.generateTokens(user);
  }

  async signin(
    data: SigninInput,
    { res }: GraphqlContext,
  ): Promise<SignupOutput> {
    const foundUser = await this.userService.findByEmail(data.email);

    if (!foundUser) throw new UnauthorizedError('Usuário não encontrado');

    const passwordMatches = await comparePassword(
      data.password,
      foundUser.password,
    );

    if (!passwordMatches) throw new UnauthorizedError();
    const tokens = this.generateTokens(foundUser);

    setAuthCookies(res, {
      token: tokens.token,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async signout(res: Response): Promise<boolean> {
    res.clearCookie(AUTH_COOKIE_OPTIONS.ACCESS_TOKEN.NAME);
    res.clearCookie(AUTH_COOKIE_OPTIONS.REFRESH_TOKEN.NAME);

    return true;
  }

  private generateTokens(user: User): SignupOutput {
    const token = jwtSign(
      { id: user.id, email: user.email, name: user.name },
      'token',
    );
    const refreshToken = jwtSign(
      { id: user.id, email: user.email, name: user.name },
      'refreshToken',
    );

    return { token, refreshToken, user };
  }

  async authenticateRequest(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    let user: string | undefined;

    let token: string | undefined = req.cookies?.token;
    if (!token && authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring('Bearer '.length);
    }

    let refreshToken: string | undefined = req.cookies?.refreshToken;

    if (token) {
      try {
        const payload = verifyJwt(token);
        user = payload.id;
      } catch (error) {}
    }

    if (!user && refreshToken) {
      try {
        const payload = verifyJwt(refreshToken);
        user = payload.id;

        token = jwtSign(
          {
            id: payload.id,
            email: payload.email,
            name: payload.name,
          },
          'token',
        );

        refreshToken = jwtSign(
          {
            id: payload.id,
            email: payload.email,
            name: payload.name,
          },
          'refreshToken',
        );

        setAuthCookies(res, { token, refreshToken });
      } catch (error) {
        res.clearCookie(AUTH_COOKIE_OPTIONS.ACCESS_TOKEN.NAME);
        res.clearCookie(AUTH_COOKIE_OPTIONS.REFRESH_TOKEN.NAME);
      }
    }

    return { user, token };
  }
}
