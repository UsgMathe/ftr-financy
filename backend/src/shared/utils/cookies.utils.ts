import { AUTH_COOKIE_OPTIONS } from '@/constants/cookies.constants';
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

  res.cookie(AUTH_COOKIE_OPTIONS.ACCESS_TOKEN.NAME, tokens.token, {
    ...cookieConfig,
    maxAge: AUTH_COOKIE_OPTIONS.ACCESS_TOKEN.MAX_AGE,
  });

  res.cookie(AUTH_COOKIE_OPTIONS.REFRESH_TOKEN.NAME, tokens.refreshToken, {
    ...cookieConfig,
    maxAge: AUTH_COOKIE_OPTIONS.REFRESH_TOKEN.MAX_AGE,
  });
}
