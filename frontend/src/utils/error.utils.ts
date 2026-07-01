export function getErrorMessage(error: unknown, fallback: string = "Algo inesperado aconteceu") {
  return error instanceof Error ? error.message : fallback;
}
