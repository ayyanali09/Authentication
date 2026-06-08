import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { ensureInitialAdmin } from "./utils/bootstrapAdmin.js";

const app = createApp();

async function bootstrap() {
  await connectDatabase();
  await ensureInitialAdmin();

  const server = app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
