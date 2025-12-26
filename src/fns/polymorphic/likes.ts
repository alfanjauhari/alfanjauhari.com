import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import z from "zod";
import { client } from "@/db/client";
import { likesTable } from "@/db/schemas/likes";
import { updatesTable } from "@/db/schemas/updates";

export const getUpdateLikesMetadata = createServerFn().handler(async (data) => {
  const Schema = z.object({
    slug: z.string(),
    userId: z.nanoid(),
  });

  try {
    const validatedData = Schema.parse(data);

    const metadata = await client
      .select()
      .from(likesTable)
      .leftJoinLateral(
        client
          .select()
          .from(updatesTable)
          .where(
            and(
              eq(likesTable.refTable, "updates"),
              eq(likesTable.refId, updatesTable.id),
            ),
          )
          .as("updateLikes"),
        sql`true`,
      );
  } catch (error) {}
});
