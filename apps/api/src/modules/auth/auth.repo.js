import { eq } from "drizzle-orm";
import { db } from "../../db/client.js";
import { users } from "../../db/schema/users.schema.js";
export const getUserByEmail = async (email) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
};

export const createUser = async (name, email, hashedPassword) => {
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning();

  return user;
};

export const setUserVerified = async (email) => {
  const [user] = await db
    .update(users)
    .set({ isVerified: true })
    .where(eq(users.email, email))
    .returning();

  return user;
};