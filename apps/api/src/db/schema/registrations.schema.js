import {
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { events } from "./events.schema.js";
import { users } from "./users.schema.js";

export const registrations = pgTable(
  "registrations",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    registeredAt: timestamp("registered_at").notNull().defaultNow(),
  },
  (table) => ({
    userEventUnique: unique("registrations_user_event_unique").on(
      table.userId,
      table.eventId,
    ),
  }),
);
