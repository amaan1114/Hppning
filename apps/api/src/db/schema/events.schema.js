import {
  integer,
  pgTable,
  serial,
  text,
  boolean,
  date,
  time,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users.schema.js";

export const events = pgTable("events",{
    id: serial("id").primaryKey(),
    adminId: integer("user_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    description: text("description").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    location: text("location").notNull(),
    date: date("date").notNull(),
    time: time("time").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

})