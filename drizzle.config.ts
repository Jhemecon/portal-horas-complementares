import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "server/src/db/schema.ts",
  out: "server/src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_CONNECTION_URL!,
  },
  verbose: true,
  strict: true,
});