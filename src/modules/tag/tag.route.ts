import { FastifyInstance } from "fastify";
import {
  registerRenderEmergencyTagHandler,
  registerRenderNotConfiguredTagHandler,
  registerRenderTagScheduleHandler,
  registerRenderLogoHandler,
} from "./tag.controller";
import { $ref } from "./tag.schema";

async function tagRoutes(server: FastifyInstance) {
  server.post(
    "/schedule",
    {
      schema: {
        body: $ref("renderTagScheduleSchema"),
      },
    },
    registerRenderTagScheduleHandler
  );

  server.post(
    "/emergency",
    {
      schema: {
        body: $ref("renderEmergencyTagSchema"),
      },
    },
    registerRenderEmergencyTagHandler
  );

  server.post(
    "/configure",
    {
      schema: {
        body: $ref("renderNotConfiguredTagSchema"),
      },
    },
    registerRenderNotConfiguredTagHandler
  );

  server.post(
    "/logo",
    {
      schema: {
        body: $ref("renderLogoSchema"),
      },
    },
    registerRenderLogoHandler
  );
}

export default tagRoutes;
