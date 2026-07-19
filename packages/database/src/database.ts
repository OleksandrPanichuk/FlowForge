import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export function createDatabase(databaseUrl: string) {
  const client = postgres(databaseUrl);

  return {
    db: drizzle({ client }),
    close: () => client.end(),
  };
}

export type Database = ReturnType<typeof createDatabase>['db'];
