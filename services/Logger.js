import pino from "pino";

class Logger {
  constructor({ Config }) {
    const logTargets = [];

    if (Config.BETTERSTACK_SOURCE_TOKEN) {
      logTargets.push({
        target: "@logtail/pino",
        options: {
          sourceToken: Config.BETTERSTACK_SOURCE_TOKEN,
        },
        level: Config.LOG_LEVEL,
      });
    }

    if (Config.LOG_PRETTY) {
      logTargets.push({
        target: "pino-pretty",
        options: {
          colorize: true,
        },
        level: Config.LOG_LEVEL,
      });
    }

    const transports = pino.transport({
      targets: logTargets,
    });

    this.logger = pino(transports);
    return this.logger;
  }
}

export { Logger };
