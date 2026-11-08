import {
  pgTable,
  serial,
  text,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
});