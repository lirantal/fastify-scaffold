import fp from "fastify-plugin";
import CloseWithGrace from "close-with-grace";
import { container } from "../../infra/di.js";

/**
 *
 * @param {*} server
 * @param {*} options
 */
async function plugin(server, options) {
  server.addHook("onClose", async () => {
    await gracefulShutdown(server, container.resolve("Database"));
  });

  CloseWithGrace(async function ({ err }) {
    const Logger = container.resolve("Logger");
    if (err) {
      Logger.error(err);
      process.exit(1);
    }

    await server.close();
  });
}

async function gracefulShutdown(server, database) {
  await database.close();
}

export default fp(plugin, {
  name: "shutdown",
});
