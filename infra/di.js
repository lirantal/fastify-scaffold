// Import all the dependencies we need
import { Logger } from "../services/Logger.js";
import { AuthManager } from "../services/AuthManager.js";

// The dependency injection framework
import { createContainer, InjectionMode, asClass, asValue } from "awilix";

const container = createContainer({ injectionMode: InjectionMode.PROXY });

async function initDI({ config, database }) {
  container.register({
    Config: asValue(config),
    Database: asValue(database),
    Logger: asClass(Logger).singleton(),
    AuthManager: asClass(AuthManager).singleton(),
  });

  return container;
}

export { initDI, container };
