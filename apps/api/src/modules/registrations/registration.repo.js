import { and, eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { registrations } from "../../db/schema/registrations.schema.js";
import { users } from "../../db/schema/users.schema.js";

export const createRegistration = async (userId, eventId) => {
  const [registration] = await db
    .insert(registrations)
    .values({ userId, eventId })
    .onConflictDoNothing()
    .returning();
  return registration;
};

export const deleteRegistration = async (userId, eventId) => {
  const [registration] = await db
    .delete(registrations)
    .where(and(eq(registrations.userId, userId), eq(registrations.eventId, eventId)))
    .returning();
  return registration;
};

export const getRegistrationsByUser = async (userId) =>
  db.select().from(registrations).where(eq(registrations.userId, userId));

export const getRegistrationsByEvent = async (eventId) =>
  db
    .select({
      id: registrations.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      registeredAt: registrations.registeredAt,
    })
    .from(registrations)
    .innerJoin(users, eq(registrations.userId, users.id))
    .where(eq(registrations.eventId, eventId));
