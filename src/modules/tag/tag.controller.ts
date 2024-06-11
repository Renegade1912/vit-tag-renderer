import { FastifyReply, FastifyRequest } from "fastify";
import { RenderEmergencyTagBody, RenderTagScheduleBody } from "./tag.schema";
import { renderEmergencyTag, renderSchedule } from "../../utils/canvas";

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

export async function registerRenderEmergencyTagHandler(
  request: FastifyRequest<{
    Body: RenderEmergencyTagBody;
  }>,
  reply: FastifyReply
) {
  const { height, width } = request.body;

  try {
    // Render the emergency tag
    const imgBuffer = await renderEmergencyTag(height, width);

    reply.header("Content-Type", "image/jpeg").code(201).send(imgBuffer);
  } catch (error) {
    console.log(error);
    reply.code(500).send("Internal Server Error");
  }
}
