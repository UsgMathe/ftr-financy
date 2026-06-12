import { AuthService } from '@/modules/auth/auth.service';
import { ExpressContextFunctionArgument } from '@as-integrations/express5';
import { UserRole } from './enums/user-role.enum';

export type GraphqlContext = {
  user: string | undefined;
  role: UserRole | undefined;
  token: string | undefined;
  req: ExpressContextFunctionArgument['req'];
  res: ExpressContextFunctionArgument['res'];
};

const authService = new AuthService();

export const buildContext = async ({
  req,
  res,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
  const { user, role, token } = await authService.authenticateRequest(req, res);

  return { user, role, token, req, res };
};
