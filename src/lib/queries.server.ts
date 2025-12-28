import type { SQL } from "drizzle-orm";
import type { PgColumn, PgSelect } from "drizzle-orm/pg-core";
import { client } from "@/db/client";

export function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: (PgColumn | SQL | SQL.Aliased)[],
  page = 1,
  pageSize = 10,
) {
  const countQuery = () => client.$count(qb);

  const dataQuery = () =>
    qb
      .orderBy(...orderByColumn)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

  return {
    countQuery,
    dataQuery,
  };
}
