import { buildSchemas } from "../utils";

export const statusProfilesTable = buildSchemas("status_profiles", (t) => ({
  scope: t
    .varchar("scope", { length: 32 })
    .notNull()
    .unique()
    .default("global"),
  timezone: t
    .varchar("timezone", { length: 100 })
    .notNull()
    .default("Asia/Jakarta"),
  locationLabel: t
    .varchar("location_label", { length: 120 })
    .notNull()
    .default("Jakarta, ID"),
  latitude: t.doublePrecision("latitude").notNull().default(-6.2088),
  longitude: t.doublePrecision("longitude").notNull().default(106.8456),
  focusText: t.text("focus_text"),
  focusProgress: t.integer("focus_progress"),
  projectName: t.text("project_name"),
  projectMilestone: t.text("project_milestone"),
  projectProgress: t.integer("project_progress"),
  projectStatus: t.varchar("project_status", { length: 80 }),
  readingTitle: t.text("reading_title"),
  readingAuthor: t.text("reading_author"),
  readingProgress: t.integer("reading_progress"),
  playingTitle: t.text("playing_title"),
  playingPlatform: t.varchar("playing_platform", { length: 80 }),
  weatherManualSummary: t.text("weather_manual_summary"),
  weatherManualTempC: t.doublePrecision("weather_manual_temp_c"),
  weatherAutoSummary: t.text("weather_auto_summary"),
  weatherAutoTempC: t.doublePrecision("weather_auto_temp_c"),
  weatherSyncedAt: t.timestamp("weather_synced_at"),
}));

export const statusStocksTable = buildSchemas("status_stocks", (t) => ({
  symbol: t.varchar("symbol", { length: 24 }).notNull().unique(),
  sortOrder: t.integer("sort_order").notNull().default(0),
  autoPrice: t.doublePrecision("auto_price"),
  autoChangePercent: t.doublePrecision("auto_change_percent"),
  currency: t.varchar("currency", { length: 12 }),
  delayed: t.boolean("delayed").notNull().default(true),
  syncedAt: t.timestamp("synced_at"),
}));
