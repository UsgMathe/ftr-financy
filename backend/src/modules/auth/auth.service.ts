import { Request, Response } from 'express';

import { AUTH_COOKIE_OPTIONS } from '@/constants/cookies.constants';
import { User } from '@/generated/prisma/client';
import { GraphqlContext } from '@/graphql/graphql.context';
import { UnauthorizedError } from '@/shared/errors/unauthorized.error';
import { setAuthCookies } from '@/shared/utils/cookies.utils';
import { comparePassword } from '@/shared/utils/hash.utils';
import { jwtSign, verifyJwt } from '@/shared/utils/jwt.utils';

import { UserService } from '../user/user.service';
import { SigninInput, SigninOutput } from './dtos/signin.dto';
import { SignupInput } from './dtos/signup.dto';

export class AuthService {
  private readonly userService = new UserService();

  async signup(data: SignupInput) {
    return await this.userService.createUser(data);
  }

  async signin(
    data: SigninInput,
    { res }: GraphqlContext,
  ): Promise<SigninOutput> {
    const foundUser = await this.userService.findByEmail(data.email);

    if (!foundUser) throw new UnauthorizedError('Usuário não encontrado');

    const passwordMatches = await comparePassword(
      data.password,
      foundUser.password,
    );

    if (!passwordMatches) throw new UnauthorizedError('Senha incorreta');
    const tokens = this.generateTokens(foundUser);

    setAuthCookies(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async signout(res: Response): Promise<boolean> {
    res.clearCookie(AUTH_COOKIE_OPTIONS.ACCESS_TOKEN.NAME);
    res.clearCookie(AUTH_COOKIE_OPTIONS.REFRESH_TOKEN.NAME);

    return true;
  }

  private generateTokens(user: User): SigninOutput {
    const accessToken = jwtSign(
      { id: user.id, email: user.email, name: user.name },
      'acessToken',
    );
    const refreshToken = jwtSign(
      { id: user.id, email: user.email, name: user.name },
      'refreshToken',
    );

    return { accessToken, refreshToken, user };
  }

  async authenticateRequest(req: Request, res: Response) {
    const authHeader = req.headers.authorization;

    let user: string | undefined;
    let accessToken: string | undefined =
      req.cookies?.[AUTH_COOKIE_OPTIONS.ACCESS_TOKEN.NAME];

    if (!accessToken && authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.substring('Bearer '.length);
    }

    let refreshToken: string | undefined =
      req.cookies?.[AUTH_COOKIE_OPTIONS.REFRESH_TOKEN.NAME];

    if (accessToken) {
      try {
        const payload = verifyJwt(accessToken);
        user = payload.id;
      } catch (error) {}
    }

    if (!user && refreshToken) {
      try {
        const payload = verifyJwt(refreshToken);
        user = payload.id;

        accessToken = jwtSign(
          {
            id: payload.id,
            email: payload.email,
            name: payload.name,
          },
          'acessToken',
        );

        refreshToken = jwtSign(
          {
            id: payload.id,
            email: payload.email,
            name: payload.name,
          },
          'refreshToken',
        );

        setAuthCookies(res, { accessToken: accessToken, refreshToken });
      } catch (error) {
        res.clearCookie(AUTH_COOKIE_OPTIONS.ACCESS_TOKEN.NAME);
        res.clearCookie(AUTH_COOKIE_OPTIONS.REFRESH_TOKEN.NAME);
      }
    }

    return { user, accessToken };
  }
}
