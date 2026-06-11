import { User } from '@/generated/prisma/browser';
import { prismaClient } from '@/prisma/prisma.client';
import { ConflictError } from '@/shared/errors/conflict.error';
import { UnauthorizedError } from '@/shared/errors/unauthorized.error';
import { comparePassword, hashPassword } from '@/shared/utils/hash.utils';
import { signJwt } from '@/shared/utils/jwt.utils';

import { GraphqlContext } from '@/graphql/graphql.context';
import { setAuthCookies } from '@/shared/utils/cookies.utils';
import { SigninInput } from './dtos/signin.dto';
import { SignupInput, SignupOutput } from './dtos/signup.dto';

export class AuthService {
  async signup(data: SignupInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictError('Email já cadastrado');
    }

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password),
      },
    });

    return this.generateTokens(user);
  }

  async signin(data: SigninInput, { res }: GraphqlContext) {
    const foundUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

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

  private generateTokens(user: User): SignupOutput {
    const token = signJwt({ id: user.id, email: user.email }, '15m');
    const refreshToken = signJwt({ id: user.id, email: user.email }, '1d');

    return { token, refreshToken, user };
  }
}
