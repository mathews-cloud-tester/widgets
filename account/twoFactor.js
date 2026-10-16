import { createHmac, randomBytes } from "node:crypto";

const STEP_SECONDS = 30;

export function newSecret() {
  return randomBytes(20);
}

/** The 6-digit code for `secret` at `timeMs`, as an authenticator app shows it. */
export function totp(secret, timeMs = Date.now()) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(timeMs / 1000 / STEP_SECONDS)));
  const digest = createHmac("sha1", secret).update(counter).digest();
  const offset = digest[digest.length - 1] & 0xf;
  const value = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return value.toString().padStart(6, "0");
}

/** Accepts the current code and the one either side of it, for clock drift. */
export function verifyCode(secret, code, timeMs = Date.now()) {
  return [-1, 0, 1].some((step) => totp(secret, timeMs + step * STEP_SECONDS * 1000) === code);
}

export function recoveryCodes(count = 10) {
  return Array.from({ length: count }, () => randomBytes(5).toString("hex"));
}
