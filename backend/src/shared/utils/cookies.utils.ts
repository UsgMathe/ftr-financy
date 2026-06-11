import { CookieOptions, Response } from 'express';

export function setAuthCookies(
  res: Response,
  tokens: { token: string; refreshToken: string },
) {
  const isProd = process.env.NODE_ENV === 'production';

  const cookieConfig: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };

  res.cookie('token', tokens.token, {
    ...cookieConfig,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    ...cookieConfig,
    maxAge: 24 * 60 * 60 * 1000,
  });
}
