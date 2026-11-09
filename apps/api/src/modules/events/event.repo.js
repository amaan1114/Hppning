import { and, eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { events } from "../../db/schema/events.schema.js";

export const createEvent = async (event) => {
  const [createdEvent] = await db.insert(events).values(event).returning();
  return createdEvent;
};

export const getEvents = async () => db.select().from(events);

export const getEventById = async (id) => {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);
  return event;
};

export const updateEvent = async (id, adminId, event) => {
  const [updatedEvent] = await db
    .update(events)
    .set(event)
    .where(and(eq(events.id, id), eq(events.adminId, adminId)))
    .returning();
  return updatedEvent;
};

export const deleteEvent = async (id, adminId) => {
  const [deletedEvent] = await db
    .delete(events)
    .where(and(eq(events.id, id), eq(events.adminId, adminId)))
    .returning();
  return deletedEvent;
};