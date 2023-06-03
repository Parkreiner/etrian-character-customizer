/**
 * @file Defines centralized error logging for the client app.
 *
 * Currently just uses console.error, but eventually these will be swapped out
 * for a logging service.
 */

export function parseError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }

  let newError: Error;
  try {
    newError = new Error(`Non-error value ${JSON.stringify(value)} thrown`);
  } catch (_) {
    if (value === undefined) {
      newError = new Error("undefined thrown as error");
    } else {
      newError = new Error("Unparseable value thrown as error");
    }
  }

  newError.cause = value;
  return newError;
}

export function handleError(...values: readonly unknown[]) {
  console.error(...values.map(parseError));
}
