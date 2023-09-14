import test from "node:test";
import assert from "node:assert";

import AppFramework from "../app.js";

import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";

import { config } from "../services/core/config.js";

test("AppFramework bootstraps successfully", async () => {
  const app = Fastify();
  app.register(fastifyPlugin(AppFramework), { config });
  await app.ready();
  assert.ok(app);
  await app.close();
});
