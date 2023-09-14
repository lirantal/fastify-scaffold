import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyBasicAuth from "@fastify/basic-auth";
import fastifyAuth from "@fastify/auth";

import { container } from "../infra/di.js";
/**
 *
 * @param {*} server
 * @param {*} opts
 */
async function plugin(server, opts) {
  // Register the plugin before your routes

  const Config = container.resolve("Config");

  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Test swagger",
        description: "Application's OpenAPI 3.0 specification",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost",
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "apiKey",
            in: "header",
          },
        },
      },
    },
  });

  await server.register(fastifyBasicAuth, {
    validate: async (username, password, req, reply) => {
      if (
        username === Config.SWAGGER_USERNAME &&
        password === Config.SWAGGER_PASSWORD
      ) {
        return;
      }
      return new Error("Unauthorized");
    },
    authenticate: {
      realm: "OpenAPI Swagger",
    },
  });

  await server.register(fastifyAuth);

  server.register(fastifySwaggerUi, {
    routePrefix: "/swagger",
    initOAuth: {},
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: server.auth([server.basicAuth]),
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}

export default fp(plugin, {
  name: "swagger",
});
