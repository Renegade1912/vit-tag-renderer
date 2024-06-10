import { FastifyInstance } from "fastify";
import { registerRenderTagScheduleHandler } from "./tag.controller";
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
}

export default tagRoutes;
