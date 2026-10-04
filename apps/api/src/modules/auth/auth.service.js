import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function register(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  // TODO: Save user using your configured database/ORM.
  const user = {
    id: "generated-user-id",
    email,
    password: hashedPassword,
  };

  return {
    id: user.id,
    email: user.email,
  };
}

export async function login(email, password) {
  // TODO: Fetch user using your configured database/ORM.

  const user = {
    id: "generated-user-id",
    email,
    password: await bcrypt.hash(password, 10),
  };

  const passwordValid = await bcrypt.compare(
    password,
    user.password,
  );

  if (!passwordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return { token };
}