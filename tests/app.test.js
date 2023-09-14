import test from "node:test";
import assert from "node:assert";

import { startApp, closeApp } from "../utils/tests/infra.js";

test("AppFramework bootstraps successfully", async () => {
  const app = await startApp();
  assert.ok(app);
  await closeApp(app);
});
