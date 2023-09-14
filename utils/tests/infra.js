import AppFramework from "../../app.js";
import { initConfig } from "../../services/core/config.js";

import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";

import isPortReachable from "is-port-reachable";
import dockerCompose from "docker-compose";
import isCI from "is-ci";

import { execSync } from "child_process";
import { fileURLToPath } from "node:url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRootPath = path.join(__dirname, "../../");
const dockerComposePath = __dirname;
const dockerComposeFilename = "docker-compose-tests.yml";

const envFilePath = path.join(__dirname, "./.env");

/**
 * Start a Fastify app instance
 */
async function startApp(config) {
  const app = Fastify();
  app.register(fastifyPlugin(AppFramework), { config });
  return app.ready();
}

/**
 * Close a Fastify app
 */
async function closeApp() {
  return app.close();
}

/**
 * Test harness setup
 */
async function setUp() {
  const dotEnvFilePath = envFilePath
    ? envFilePath
    : path.join(__dirname, ".env");

  const config = await initConfig({
    envSchemaOptions: {
      dotenv: {
        path: dotEnvFilePath,
      },
    },
  });

  console.log("Test harness: bootstrapping environment\n");
  const isDatabaseRunning = await isPortReachable(config.DB_PORT, {
    host: config.DB_HOST,
  });
  if (!isDatabaseRunning) {
    try {
      await dockerCompose.upAll({
        cwd: dockerComposePath,
        config: dockerComposeFilename,
        log: true,
      });
    } catch (error) {
      console.error(error);
      console.error("Error: unable to start docker-compose file for test");
    }
  }

  try {
    await dockerCompose.exec(
      "db",
      ["sh", "-c", "until pg_isready; do sleep 1; done"],
      {
        cwd: dockerComposePath,
        config: dockerComposeFilename,
      }
    );
  } catch (error) {
    console.error(error);
    console.error("Error: unable to verify database readiness for test");
  }

  console.log("Test harness: running database migrations\n");
  execSync("npm run db:migrate", {
    env: {
      ...process.env,
      APP_DOTENV_FILE: envFilePath,
    },
    cwd: projectRootPath,
    encoding: "utf-8",
    stdio: "inherit",
  });

  console.log("\n\nTest harness: ready to process tests\n");
}

/**
 * Test harness tear down
 */
async function tearDown() {
  if (isCI) {
    console.log("Test harness: shutting down test environment");
    dockerCompose.down({
      cwd: dockerComposePath,
      config: dockerComposeFilename,
      log: true,
    });
  }
}

export { setUp, tearDown, startApp, closeApp };
