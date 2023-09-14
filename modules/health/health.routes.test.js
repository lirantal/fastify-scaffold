import test from "node:test";
import assert from "node:assert";
import { generateToken } from "../../utils/token.js";
import { startApp, closeApp } from "../../utils/tests/infra.js";

test.describe("Health Routes", async () => {
  let app;

  // @TODO refactor the per-test headers injection into a global hook in test.before
  const authorizationToken = await generateToken();

  test.before(async () => {
    app = await startApp();
  });

  test.after(async () => {
    await closeApp(app);
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
