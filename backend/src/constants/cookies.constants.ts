export const AUTH_COOKIE_OPTIONS = {
  ACCESS_TOKEN: {
    NAME: 'accessToken',
    MAX_AGE: 15 * 60 * 1000,
  },
  REFRESH_TOKEN: {
    NAME: 'refreshToken',
    MAX_AGE: 24 * 60 * 60 * 1000,
  },
}