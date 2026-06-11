import { AppError } from './app.error';

export class ConflictError extends AppError {
  constructor(message = 'O recurso já existe') {
    super(message, 409);
  }
}
