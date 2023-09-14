import pino from "pino";

class Logger {
  constructor({ Config }) {
    this.logger = pino({
      level: Config.LOG_LEVEL,
      transport: Config.LOG_PRETTY && {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    });

    return this.logger;
  }
}

export { Logger };
