// app/api/helpers/apiResponse.js

/**
 * Build a standardized Next.js Response for our API routes.
 *
 * @param {Object}  options
 * @param {?string} options.errorMessage – Error text (null if none)
 * @param {?any}    options.payload      – Data payload (null if none)
 * @param {number}  options.statusCode   – HTTP status code (defaults to 200)
 * @returns {Response}
 */
export function buildApiResponse({
  errorMessage = null,
  payload      = null,
  statusCode   = 200,
} = {}) {
  const body = {
    success:    errorMessage === null,
    error:      errorMessage,
    payload:    payload,
  };

  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
