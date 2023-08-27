import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email")
});
