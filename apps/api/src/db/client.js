import {config} from "../utils/config.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: config.databaseUrl,
});

export const db = drizzle({
  client: pool,
});