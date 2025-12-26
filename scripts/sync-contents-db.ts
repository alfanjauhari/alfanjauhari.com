import { execSync } from "node:child_process";
import { allRestrictedUpdates, allUpdates } from "content-collections";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const CONTENT_ROOT = "content/privates";

if (!process.env.APP_DATABASE_URL) {
  throw new Error("APP_DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: process.env.APP_DATABASE_URL,
});
const client = drizzle(pool);

const gitSha = execSync(`git -C ${CONTENT_ROOT} rev-parse HEAD`)
  .toString()
  .trim();

const updates = [...allUpdates, ...allRestrictedUpdates].map((update) => ({
  title: update.title,
  slug: update._meta.path,
  summary: update.summary,
  date: update.date.toISOString(),
  git_sha: gitSha,
  source_path: `${CONTENT_ROOT}/updates`,
}));

const sqlChunks = [
  sql`INSERT INTO updates (title, slug, summary, date, git_sha, source_path) VALUES`,
  ...updates.map((update, index, self) =>
    index === self.length - 1
      ? sql`(${update.title}, ${update.slug}, ${update.summary}, ${update.date}, ${update.git_sha}, ${update.source_path}) `
      : sql`(${update.title}, ${update.slug}, ${update.summary}, ${update.date}, ${update.git_sha}, ${update.source_path}),`,
  ),
  sql`ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, slug = EXCLUDED.slug, summary = EXCLUDED.summary, date = EXCLUDED.date, git_sha = EXCLUDED.git_sha, source_path = EXCLUDED.source_path`,
];

await client.execute(sql.join(sqlChunks));
console.info(`Successfully sync ${updates.length} contents to db!`);

await pool.end();
