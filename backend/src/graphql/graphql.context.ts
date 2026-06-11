import { verifyJwt } from '@/shared/utils/jwt.utils';
import { ExpressContextFunctionArgument } from '@as-integrations/express5';

export type GraphqlContext = {
  user: string | undefined;
  token: string | undefined;
  req: ExpressContextFunctionArgument['req'];
  res: ExpressContextFunctionArgument['res'];
};

export const buildContext = async ({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
  const authHeader = req.headers.authorization;

  let user: string | undefined;
  let token: string | undefined;

  token = authHeader?.substring('Bearer '.length) ?? req.cookies?.token;

  if (token) {
    try {
      const payload = verifyJwt(token);
      user = payload.id;
    } catch (error) {}
  }

  return { user, token, req, res };
};
