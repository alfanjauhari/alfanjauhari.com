import { execSync } from "node:child_process";
import {
  allRestrictedUpdates,
  allUpdates,
  type Update,
} from "content-collections";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const PRIVATE_CONTENT_DIR = "content/privates";

if (!process.env.APP_DATABASE_URL) {
  throw new Error("APP_DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: process.env.APP_DATABASE_URL,
});
const client = drizzle(pool);

const gitSha = execSync(`git -C ${PRIVATE_CONTENT_DIR} rev-parse HEAD`)
  .toString()
  .trim();

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
    git_sha: gitSha,
  }));

const sqlChunks = [
  sql`INSERT INTO updates (title, slug, summary, date, git_sha) VALUES`,
  ...updates.map((update, index, self) =>
    index === self.length - 1
      ? sql`(${update.title}, ${update.slug}, ${update.summary}, ${update.date}, ${update.git_sha}) `
      : sql`(${update.title}, ${update.slug}, ${update.summary}, ${update.date}, ${update.git_sha}),`,
  ),
  sql`ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, slug = EXCLUDED.slug, summary = EXCLUDED.summary, date = EXCLUDED.date, git_sha = EXCLUDED.git_sha`,
];

await client.execute(sql.join(sqlChunks));
console.info(`Successfully sync ${updates.length} contents to db!`);

await pool.end();
