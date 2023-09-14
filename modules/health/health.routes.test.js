import test from "node:test";
import assert from "node:assert";
import { generateToken } from "../../utils/token.js";
import AppFramework from "../../app.js";
import Fastify from "fastify";
import fastifyPlugin from "fastify-plugin";

// @TODO refactor the per-test headers injection into a global hook in test.before
const authorizationToken = generateToken();

test.describe("Health Routes", () => {
  let app;

  test.before(async () => {
    app = Fastify();
    app.register(fastifyPlugin(AppFramework));
    await app.ready();
  });

  test.after(async () => {
    await app.close();
  });

  test("GET /health responds with 200 OK", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: {
        authorization: `Bearer ${authorizationToken}`,
      },
    });

    assert.deepStrictEqual(response.statusCode, 200);
  });

  test("GET /health responds with expected schema in body", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
      headers: {
        authorization: `Bearer ${authorizationToken}`,
      },
    });

    const data = response.json();
    assert.equal(data.echoText, "Hello World");
    assert.equal(data.status, true);
    assert.equal(data.stats.length, 2);
    assert.equal(data.stats[0].uptime > 0, true);
    assert.equal(data.stats[1].external > 0, true);
    assert.equal(data.stats[1].heapTotal > 0, true);
    assert.equal(data.stats[1].heapUsed > 0, true);
    assert.equal(data.stats[1].rss > 0, true);
    assert.equal(data.debugLevel, app.config.LOG_LEVEL);
  });
});
