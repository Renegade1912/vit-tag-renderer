import { FastifyReply, FastifyRequest } from "fastify";
import {
  RenderEmergencyTagBody,
  RenderNotConfiguredTagBody,
  RenderTagScheduleBody,
  RenderLogoBody,
} from "./tag.schema";
import {
  renderEmergencyTag,
  renderNotConfiguredTag,
  renderSchedule,
  renderLogo,
} from "../../utils/canvas";

export async function registerRenderTagScheduleHandler(
  request: FastifyRequest<{
    Body: RenderTagScheduleBody;
  }>,
  reply: FastifyReply
) {
  const { name, date, url, height, width, events } = request.body;

  try {
    // Render the schedule
    const imgBuffer = await renderSchedule(
      name,
      date,
      url,
      height,
      width,
      events
    );

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

export async function registerRenderNotConfiguredTagHandler(
  request: FastifyRequest<{
    Body: RenderNotConfiguredTagBody;
  }>,
  reply: FastifyReply
) {
  const { height, width, url } = request.body;

  try {
    // Render the not configured tag
    const imgBuffer = await renderNotConfiguredTag(height, width, url);

    reply.header("Content-Type", "image/jpeg").code(201).send(imgBuffer);
  } catch (error) {
    console.log(error);
    reply.code(500).send("Internal Server Error");
  }
}

export async function registerRenderLogoHandler(
  request: FastifyRequest<{
    Body: RenderLogoBody;
  }>,
  reply: FastifyReply
) {
  const { height, width } = request.body;

  try {
    // Render the logo
    const imgBuffer = await renderLogo(height, width);

    reply.header("Content-Type", "image/jpeg").code(201).send(imgBuffer);
  } catch (error) {
    console.log(error);
    reply.code(500).send("Internal Server Error");
  }
}
