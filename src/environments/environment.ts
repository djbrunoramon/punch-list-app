/**
 * Production build configuration.
 *
 * `apiBaseUrl` is prepended to every `/api/...` call. Leave it empty when the SPA is served from
 * the same origin as the API (reverse proxy); otherwise set it to the API origin before building,
 * e.g. `https://api.example.com` (that origin must be listed in the API's APP_CORS_ALLOWED_ORIGINS).
 */
export const environment = {
  apiBaseUrl: '',
};
