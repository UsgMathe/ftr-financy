import { AuthService } from '@/modules/auth/auth.service';
import { ExpressContextFunctionArgument } from '@as-integrations/express5';

export type GraphqlContext = {
  user: string | undefined;
  token: string | undefined;
  req: ExpressContextFunctionArgument['req'];
  res: ExpressContextFunctionArgument['res'];
};

const authService = new AuthService();

export const buildContext = async ({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
  const { user, token } = await authService.authenticateRequest(req, res);

  return { user, token, req, res };
};
