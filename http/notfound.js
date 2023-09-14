import fp from "fastify-plugin";

/**
 *
 * @param {*} server
 * @param {*} opts
 */
async function plugin(server, opts) {
  const HTTP_NOT_FOUND = 404;

  server.setNotFoundHandler((request, reply) => {
    request.log.error({
      message: `Route ${request.method}:${request.url} not found`,
      code: HTTP_NOT_FOUND,
      name: "Not found",
    });

    return reply.code(HTTP_NOT_FOUND).send({
      statusCode: HTTP_NOT_FOUND,
      message: "Not Found",
    });
  });
}

export default fp(plugin, {
  name: "notFoundHandler",
});
