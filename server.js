import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";

import { Config } from "./services/core/Config.js";
import { DatabaseManager } from "./services/core/db.js";
import { initDI } from "./infra/di.js";
import AppFramework from "./app.js";

// Load configuration
const configManager = new Config();
const config = await configManager.load();

// Initialize the database
const database = await initDatabase(config);

// Initialize DI
const diContainer = await initDI({ config, database });

// Initialize the app server
await initAppServer(config);

async function initDatabase(config) {
  // Initialize the database
  const database = new DatabaseManager(config);

  // Ensure database connection is ready
  await database.ping();

  // Return the database instance
  return database;
}

async function initAppServer(config) {
  // Initialize a Fastify server
  const app = Fastify({
    logger: diContainer.resolve("Logger"),
  });

  // Register the Fastify application as a plugin
  app.register(fastifyPlugin(AppFramework), { config });

  // Initialize the applications, plugins, hooks, etc
  // in the Fastify framework
  await app.ready();

  // Start the server
  try {
    await app.listen({
      port: app.config.PORT,
      host: app.config.HOST,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
