import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function getDbUrl(): string | null {
  return process.env.DATABASE_URL ?? null;
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const url = getDbUrl();
  if (!url) return null;

  if (!_db) {
    const client = postgres(url);
    _db = drizzle(client, { schema });
  }

  return _db;
}

export { schema };
