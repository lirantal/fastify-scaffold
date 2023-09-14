/**
 *
 * @param {*} server
 * @param {*} options
 */
export default async function healthRoute(server, options) {
  server.get(
    "/",
    {
      schema: {
        description: "server health endpoint",
        querystring: {
          type: "object",
          properties: {
            echo: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              echoText: { type: "string" },
              status: { type: "boolean" },
              stats: { type: "array" },
              debugLevel: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const memory = process.memoryUsage();
      const uptime = process.uptime() * 1000;
      const stats = [
        {
          uptime: uptime,
        },
        {
          rss: memory.rss,
          external: memory.external,
          heapUsed: memory.heapUsed,
          heapTotal: memory.heapTotal,
        },
      ];

      const debugLevel = server.config["LOG_LEVEL"];
      const echoText = request.query.echo || "Hello World";
      return reply.send({ echoText, stats, status: true, debugLevel });
    }
  );
}
