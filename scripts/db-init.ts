import path from "node:path";
import {
  allRestrictedUpdates,
  allUpdates,
  type Update,
} from "content-collections";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

async function main() {
  if (!process.env.APP_DATABASE_URL) {
    throw new Error("APP_DATABASE_URL is required");
  }

  const pool = new Pool({
    connectionString: process.env.APP_DATABASE_URL,
  });
  const client = drizzle(pool);

  console.info("Running migration");
  await migrate(client, {
    migrationsFolder: path.join(process.cwd(), "drizzle"),
  }).then(() => console.info("Successfully migrated"));

  const updates = [...allUpdates, ...allRestrictedUpdates]
    .reduce((unique, update) => {
      if (!unique.some((u) => u._meta.path === update._meta.path)) {
        unique.push(update);
      }

      return unique;
    }, [] as Update[])
    .map((update) => ({
      title: update.title,
      slug: update._meta.path,
      summary: update.summary,
      date: update.date.toISOString(),
    }));

  const sqlChunks = [
    sql`INSERT INTO updates (title, slug, summary, date) VALUES`,
    ...updates.map((update, index, self) =>
      index === self.length - 1
        ? sql`(${update.title}, ${update.slug}, ${update.summary}, ${update.date}) `
        : sql`(${update.title}, ${update.slug}, ${update.summary}, ${update.date}),`,
    ),
    sql`ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, slug = EXCLUDED.slug, summary = EXCLUDED.summary, date = EXCLUDED.date`,
  ];

  await client.execute(sql.join(sqlChunks));
  console.info(`Successfully sync ${updates.length} contents to db!`);

  await pool.end();
}

main();
