import { JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_TOKEN_EXPIRES_IN } from '@/constants/jwt.constants';
import { User } from '@/generated/prisma/browser';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export type JwtPayload = Pick<User, 'id' | 'name' | 'email' | 'role'>;

export const jwtSign = (payload: JwtPayload, type: 'token' | 'refreshToken') => {
  const secret: Secret = process.env.JWT_SECRET!;

  let expiresIn: SignOptions['expiresIn'];

  switch (type) {
    case 'token':
      expiresIn = JWT_TOKEN_EXPIRES_IN;
      break;
    case 'refreshToken':
      expiresIn = JWT_REFRESH_TOKEN_EXPIRES_IN;
      break;
    default:
      throw new Error('Tipo de token inválido');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyJwt = (token: string) => {
  const secret: Secret = process.env.JWT_SECRET!;
  return jwt.verify(token, secret) as JwtPayload;
};
