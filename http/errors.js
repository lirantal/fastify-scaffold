import fp from "fastify-plugin";

/**
 *
 * @param {*} server
 * @param {*} opts
 */
async function plugin(server, opts) {
  server.setErrorHandler((error, request, reply) => {
    request.log.error({
      message: error.message,
      type: error.type,
      code: error.code,
      name: error.name,
      severity: error.severity,
      // @TODO only include stack in dev mode
      stack: error.stack,
    });

    return reply.code(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
    });
  });
}

export default fp(plugin, {
  name: "errorHandler",
});
