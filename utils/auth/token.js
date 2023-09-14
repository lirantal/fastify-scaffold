import { createSigner, createVerifier } from "fast-jwt";
import { config } from "../../services/core/config.js";
const secret = config.JWT_SECRET;

export function generateToken({ data, secret: customSecretKey } = {}) {
  const signSync = createSigner({
    key: customSecretKey ? customSecretKey : secret,
  });
  const token = data ? signSync(data) : signSync({});
  return token;
}

export function verifyToken({ token }) {
  const verifySync = createVerifier({ key: secret });
  const payloadVerified = verifySync(token);
  return payloadVerified;
}
