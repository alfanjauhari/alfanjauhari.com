import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import z from "zod";
import { client } from "@/db/client";
import { usersTable } from "@/db/schemas/users";
import logger from "@/lib/logger";
import { authMiddleware } from "@/middleware/auth";

export const updateUserNameServerFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.string().min(1, "Name is required"))
  .handler(async ({ data, context }) => {
    try {
      await client.transaction(async (trx) => {
        const users = await trx
          .select({ id: usersTable.id })
          .from(usersTable)
          .where(eq(usersTable.id, context.session.user.id))
          .limit(1);

        if (!users.length) {
          throw new Error("User not found");
        }

        return trx
          .update(usersTable)
          .set({
            name: data,
          })
          .where(eq(usersTable.id, users[0].id))
          .returning();
      });

      return true;
    } catch (error) {
      logger.error(error);

      return "Something went wrong when trying to update name. Must be the wind";
    }
  });
