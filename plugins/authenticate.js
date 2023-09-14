import fp from "fastify-plugin";
import JWT from "@fastify/jwt";

/**
 *
 * @param {*} server
 * @param {*} opts
 */
async function plugin(server, opts) {
  server.register(JWT, {
    secret: server.config.JWT_SECRET,
  });

  server.addHook("onRequest", async (request, reply) => {
    // Skip authentication for swagger routes
    if (request.url.startsWith("/swagger")) {
      return;
    }

    if (request.url === "/auth/login") {
      return;
    }

    try {
      // Fastify/jwt will decorate the request with the user object
      // accessible via request.user
      await request.jwtVerify();
    } catch (err) {
      return reply.send(err);
    }
  });
}

export default fp(plugin, {
  name: "authenticate",
  dependencies: ["cors"],
});
