import {
	type BuildColumns,
	type ColumnBuilderBase,
	type HasDefault,
	type IsPrimaryKey,
	type NotNull,
	sql,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import type { SQLiteColumnBuilders } from "drizzle-orm/sqlite-core/columns/all";

export interface BaseTableColumns {
	id: IsPrimaryKey<NotNull<t.SQLiteTextBuilder<[string, ...string[]]>>>;
	createdAt: HasDefault<NotNull<t.SQLiteIntegerBuilder>>;
	updatedAt: HasDefault<NotNull<t.SQLiteIntegerBuilder>>;
}

export const buildSchemas = <
	TableName extends string,
	TSchema extends Record<string, ColumnBuilderBase>,
>(
	table: TableName,
	schema: (t: SQLiteColumnBuilders) => TSchema,
	extraConfig?: (
		self: BuildColumns<TableName, TSchema & BaseTableColumns, "sqlite">
	) => t.SQLiteTableExtraConfigValue[]
) =>
	t.sqliteTable<TableName, TSchema & BaseTableColumns>(
		table,
		(t) => ({
			id: t.text("id").primaryKey(),
			...schema(t),
			createdAt: t
				.integer("created_at")
				.default(sql`(unixepoch())`)
				.notNull(),
			updatedAt: t
				.integer("updated_at")
				.default(sql`(unixepoch())`)
				.notNull(),
		}),
		extraConfig
	);
