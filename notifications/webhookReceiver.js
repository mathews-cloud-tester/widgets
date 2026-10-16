import { createHmac, timingSafeEqual } from "node:crypto";

export function verifySignature(secret, body, signature) {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function webhookRoute(router, { secret, deliver }) {
  router.post("/webhooks/notifications", async (req, res) => {
    if (!verifySignature(secret, req.rawBody, req.get("x-signature") ?? "")) {
      res.status(401).end();
      return;
    }
    await deliver(JSON.parse(req.rawBody));
    res.status(204).end();
  });
}
