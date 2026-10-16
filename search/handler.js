import { checkRateLimit } from "./rateLimit.js";

export function handleSearch(request, response, search) {
  const limit = checkRateLimit(request);
  if (!limit.allowed) {
    response.setHeader("Retry-After", String(limit.retryAfterSeconds));
    response.status(429).json({ error: "Too many search requests" });
    return;
  }
  response.json(search(request.query.q ?? ""));
}
