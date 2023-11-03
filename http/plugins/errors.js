import fp from "fastify-plugin";

/**
 *
 * @param {*} server
 * @param {*} opts
 */
async function plugin(server, opts) {
  server.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;

    request.log.error({
      message: error.message,
      type: error.type,
      code: error.code,
      name: error.name,
      severity: error.severity,
      // @TODO only include stack in dev mode
      stack: error.stack,
    });

    // hide the error message which could leak
    // sensitive information
    const errorMessage =
      statusCode == 500 ? "Internal Server Error" : error.message;

    return reply.code(statusCode).send({
      statusCode: statusCode,
      message: errorMessage,
    });
  });
}

export default fp(plugin, {
  name: "errorHandler",
});
