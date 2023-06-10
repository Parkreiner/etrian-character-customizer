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

  if (value === undefined) {
    return new Error("undefined thrown as error");
  }

  let newError: Error;
  try {
    newError = new Error(`Non-error value ${JSON.stringify(value)} thrown`);
    newError.cause = value;
  } catch (_) {
    newError = new Error("Received error value that is not JSON-serializable");
  }

  return newError;
}

export function handleError(...values: readonly unknown[]) {
  console.error(...values.map(parseError));
}
