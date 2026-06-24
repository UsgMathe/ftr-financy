import { AppError } from './app.error';

export class BadRequestError extends AppError {
  constructor(message = 'Requisição inválida') {
    super(message, 'BAD_REQUEST', 400);
  }
}
