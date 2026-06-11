import { AppError } from './app.error';

export class UnauthorizedError extends AppError {
  constructor(message = 'Credenciais inválidas') {
    super(message, 401);
  }
}
