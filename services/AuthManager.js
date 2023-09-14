import { createSigner, createVerifier } from "fast-jwt";

class AuthManager {
  constructor({ Config }) {
    this.config = Config;
    this.secret = Config.JWT_SECRET;
  }

  /**
   *
   * @param {{data: {}, secret: string}} param0
   * @returns {string}
   */
  generateToken({ data, secret: customSecretKey } = {}) {
    // @TODO add expiration for token
    const signSync = createSigner({
      key: customSecretKey ? customSecretKey : this.secret,
    });
    const token = data ? signSync(data) : signSync({});
    return token;
  }

  /**
   *
   * @param {{token: {}}} param0
   * @returns boolean
   */
  verifyToken({ token }) {
    // @TODO verify expiration for token
    const verifySync = createVerifier({ key: this.secret });
    const payloadVerified = verifySync(token);
    return payloadVerified;
  }
}

/*
 Example usage for decoding a token:
 
 createDecoder
 const decode = createDecoder({ complete: true });
 const payload = decode(token);
 console.log(payload);
*/

export { AuthManager };
