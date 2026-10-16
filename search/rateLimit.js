export const REQUESTS_PER_MINUTE = 60;
const WINDOW_MS = 60_000;
const windows = new Map();

/** The key a request is counted under: its API key, or its IP address when it has none. */
export function rateLimitKey(request) {
  return request.headers["x-api-key"] ?? request.ip;
}

/** Whether the request is under the limit; when it is not, the seconds until it would be. */
export function checkRateLimit(request, now = Date.now()) {
  const key = rateLimitKey(request);
  const window = windows.get(key);
  if (window === undefined || now - window.startedAt >= WINDOW_MS) {
    windows.set(key, { startedAt: now, count: 1 });
    return { allowed: true };
  }
  window.count += 1;
  if (window.count <= REQUESTS_PER_MINUTE) {
    return { allowed: true };
  }
  return { allowed: false, retryAfterSeconds: Math.ceil((window.startedAt + WINDOW_MS - now) / 1000) };
}
