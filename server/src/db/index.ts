import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const pool = new Pool ({
    connectionString: process.env.DB_CONNECTION_URL,
})

export const db = drizzle(pool, { schema });