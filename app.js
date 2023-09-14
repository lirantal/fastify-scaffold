import { fileURLToPath } from "url";
import path from "path";
import autoload from "@fastify/autoload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function appFramework(fastify, opts) {
  const appConfig = opts.config;
  fastify.decorate("config", appConfig);

  // Register app framework plugins
  fastify.register(autoload, {
    dir: path.join(__dirname, "plugins"),
    encapsulate: false,
    ignorePattern: /.*(test|spec).js/,
  });

  // Register API routes
  fastify.register(autoload, {
    dir: path.join(__dirname, "modules"),
    dirNameRoutePrefix: true,
    indexPattern: /.*\.routes(\.ts|\.js|\.cjs|\.mjs)$/,
  });

  return fastify;
}
