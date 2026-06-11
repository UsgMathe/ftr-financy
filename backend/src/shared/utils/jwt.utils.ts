import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export type JwtPayload = {
  id: string;
  email: string;
};

export const signJwt = (payload: JwtPayload, expiresIn?: string) => {
  const secret: Secret = process.env.JWT_SECRET!;

  const options: SignOptions = expiresIn
    ? { expiresIn: expiresIn as SignOptions['expiresIn'] }
    : {};

  return jwt.sign(payload, secret, options);
};

export const verifyJwt = (token: string) => {
  const secret: Secret = process.env.JWT_SECRET!;
  return jwt.verify(token, secret) as JwtPayload;
};
