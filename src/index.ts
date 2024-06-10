import Fastify from "fastify";
import tagRoutes from "./modules/tag/tag.route";
import { TagSchemas } from "./modules/tag/tag.schema";

const server = Fastify();

// Run the server!
const main = async () => {
  for (const schema of TagSchemas) {
    server.addSchema(schema);
  }

  server.register(tagRoutes, { prefix: "/api/tag" });

  try {
    await server.listen({ port: 3001 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

main();
