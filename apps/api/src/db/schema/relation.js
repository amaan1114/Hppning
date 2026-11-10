import { relations } from "drizzle-orm";

import { events } from "./events.schema.js";
import { registrations } from "./registrations.schema.js";
import { users } from "./users.schema.js";

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  registrations: many(registrations),
}));

export const eventsRelations = relations(events, ({ many, one }) => ({
  admin: one(users, {
    fields: [events.adminId],
    references: [users.id],
  }),
  registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [registrations.eventId],
    references: [events.id],
  }),
}));
