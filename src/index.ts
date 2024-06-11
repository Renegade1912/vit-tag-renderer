import "dotenv/config";

import Fastify from "fastify";
import tagRoutes from "./modules/tag/tag.route";
import { TagSchemas } from "./modules/tag/tag.schema";

const server = Fastify({
  logger: process.env.NODE_ENV === "production" ? false : true,
  ajv: {
    customOptions: {
      allErrors: true,
    },
    plugins: [require("ajv-errors")],
  },
});

const port: number = parseInt(process.env.PORT ?? "3001");

// Run the server!
const main = async () => {
  for (const schema of TagSchemas) {
    server.addSchema(schema);
  }

  server.register(tagRoutes, { prefix: "/api/tag" });

  try {
    await server.listen({ port });

    console.info(`Server listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

main();
