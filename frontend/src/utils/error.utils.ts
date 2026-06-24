export function getErrorMessage(error: unknown, falback: string = "Algo inesperado aconteceu") {
  return error instanceof Error ? error.message : falback;
}
