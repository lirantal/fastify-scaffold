import { createSigner, createVerifier } from "fast-jwt";
import { Config } from "../services/core/Config.js";

const configManager = new Config();

export async function generateToken({ data, secret: customSecretKey } = {}) {
  const config = await configManager.load();
  const secretDefault = config.JWT_SECRET;

  const signSync = createSigner({
    key: customSecretKey ? customSecretKey : secretDefault,
  });
  const token = data ? signSync(data) : signSync({});
  return token;
}

export async function verifyToken({ token }) {
  const config = await configManager.load();
  const secretDefault = config.JWT_SECRET;
  const verifySync = createVerifier({ key: secretDefault });
  const payloadVerified = verifySync(token);
  return payloadVerified;
}
