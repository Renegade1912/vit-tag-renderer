import { FastifyReply, FastifyRequest } from "fastify";
import { RenderTagScheduleBody } from "./tag.schema";
import { renderSchedule } from "../../utils/canvas";

export async function registerRenderTagScheduleHandler(
  request: FastifyRequest<{
    Body: RenderTagScheduleBody;
  }>,
  reply: FastifyReply
) {
  const { name, date, height, width, events } = request.body;

  try {
    // Render the schedule
    const imgBuffer = await renderSchedule(name, height, width, date, events);

    reply.header("Content-Type", "image/jpeg").code(201).send(imgBuffer);
  } catch (error) {
    console.log(error);
    reply.code(500).send("Internal Server Error");
  }
}
