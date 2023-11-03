import fp from "fastify-plugin";
import * as fastifySentry from "@immobiliarelabs/fastify-sentry";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import { CaptureConsole, HttpClient } from "@sentry/integrations";

/**
 *
 * @param {*} server
 * @param {*} opts
 */
async function plugin(server, opts) {
  server.register(fastifySentry, {
    setErrorHandler: false,
    dsn: server.config.SENTRY_DSN,
    integrations: [
      new ProfilingIntegration(),
      new CaptureConsole(),
      new HttpClient(),
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Postgres(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
    // This option is required for capturing headers and cookies.
    sendDefaultPii: true,
  });

  server.addHook("onError", async (request, reply, error) => {
    return Sentry.captureException(error);
  });
}

export default fp(plugin, {
  name: "sentry",
});
