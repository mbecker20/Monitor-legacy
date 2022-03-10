import Fastify from "fastify";
import { PORT } from "./config";

const fastify = Fastify({
  logger: true,
});

fastify.listen(PORT, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
});
