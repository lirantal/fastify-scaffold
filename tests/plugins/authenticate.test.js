import test from "node:test";
import assert from "node:assert";
import { generateToken } from "../../utils/token.js";

import AppFramework from "../../app.js";

import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";

test.describe("Plugins: Authenticate", () => {
  let app;

  test.before(async () => {
    app = Fastify();
    app.register(fastifyPlugin(AppFramework));
    await app.ready();
  });

  test.after(async () => {
    await app.close();
  });

  test("GET / returns 401 Unauthorized if no API token provided", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    assert.deepStrictEqual(response.statusCode, 401);
  });

  test("GET / does not return a 401 Unauthorized when token is valid", async () => {
    const token = generateToken();
    const response = await app.inject({
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: "/",
    });

    assert.notEqual(response.statusCode, 401);
  });

  test("GET /health returns 401 Unauthenticated if the token is signed with a different secret of server", async () => {
    const token = generateToken({ secret: "arrakis02" });
    const response = await app.inject({
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: "/",
    });

    assert.deepStrictEqual(response.statusCode, 401);
  });
});
