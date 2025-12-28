import {
  type BuildExtraConfigColumns,
  type HasDefault,
  type IsPrimaryKey,
  type NotNull,
  sql,
} from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import type { PgColumnsBuilders } from "drizzle-orm/pg-core/columns/all";

export interface BaseTableColumns {
  id: HasDefault<
    IsPrimaryKey<NotNull<t.PgTextBuilderInitial<"id", [string, ...string[]]>>>
  >;
  createdAt: HasDefault<NotNull<t.PgTimestampBuilderInitial<"created_at">>>;
  updatedAt: HasDefault<NotNull<t.PgTimestampBuilderInitial<"updated_at">>>;
}

export const buildSchemas = <
  TableName extends string,
  TSchema extends Record<string, t.PgColumnBuilderBase>,
>(
  table: TableName,
  schema: (t: PgColumnsBuilders) => TSchema,
  extraConfig?: (
    self: BuildExtraConfigColumns<TableName, TSchema & BaseTableColumns, "pg">,
  ) => t.PgTableExtraConfigValue[],
) =>
  t.pgTable<TableName, TSchema & BaseTableColumns>(
    table,
    (t) => ({
      id: t.text("id").primaryKey().default(sql`generate_nanoid()`),
      ...schema(t),
      createdAt: t.timestamp("created_at").default(sql`now()`).notNull(),
      updatedAt: t.timestamp("updated_at").default(sql`now()`).notNull(),
    }),
    extraConfig,
  );
