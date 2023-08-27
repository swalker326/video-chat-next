import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";

import { users } from "@/db/schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "drizzle" });

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return await db.select().from(users).all();
    // return { id: 1, firstName: "Shane", lastName: "Walker" };
  }),
  addUser: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.string().email()
      })
    )
    .mutation(async (ctx) => {
      await db
        .insert(users)
        .values({
          firstName: ctx.input.firstName,
          lastName: ctx.input.lastName,
          email: ctx.input.email
        })
        .run();
      return true;
    })
});

export type AppRouter = typeof appRouter;
