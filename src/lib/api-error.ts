export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

/**
 * Try to extract the `detail` field from a message string like
 * `API 401 on /auth/login: {"detail":"Invalid name or password"}`.
 * Returns null if the message doesn't contain parseable JSON.
 */
function tryExtractDetail(message: string): string | null {
  const bodyStart = message.indexOf("{");
  if (bodyStart === -1) return null;
  try {
    const parsed = JSON.parse(message.slice(bodyStart));
    return parsed.detail ?? null;
  } catch {
    return null;
  }
}

/** Extract the `detail` field from an ApiError message, or fall back to the full message. */
export function extractApiDetail(err: ApiError): string {
  return tryExtractDetail(err.message) ?? err.message;
}

/** Get a user-friendly error message from any error type.
 *
 *  Server Actions serialize errors across the wire, so `instanceof ApiError`
 *  is always false on the client. Instead, we try to extract the `detail`
 *  field from any Error's message string. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    return tryExtractDetail(err.message) ?? err.message;
  }
  return fallback;
}
