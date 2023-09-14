import path from "node:path";
import { fileURLToPath } from "node:url";

import { Config } from "./services/core/Config.js";
import { Logger } from "./services/Logger.js";
import { DatabaseManager } from "./services/core/db.js";

const customDotEnvFilePath = process.env.APP_DOTENV_FILE;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dotEnvFilePath = customDotEnvFilePath
  ? customDotEnvFilePath
  : path.join(__dirname, ".env");

const configManager = new Config();
const config = await configManager.load({
  envSchemaOptions: {
    dotenv: {
      path: dotEnvFilePath,
    },
  },
});

new Logger({ Config: config });
const database = new DatabaseManager(config);

export default {
  client: database.dbConfig.client,
  connection: database.dbConfig.connection,
  migrations: {
    directory: "./db/migrations",
    loadExtensions: [".mjs"],
  },
  seeds: {
    directory: "./db/seeds",
    loadExtensions: [".mjs"],
  },
};
