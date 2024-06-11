import { FastifyInstance } from "fastify";
import {
  registerRenderEmergencyTagHandler,
  registerRenderTagScheduleHandler,
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
}

export default tagRoutes;
