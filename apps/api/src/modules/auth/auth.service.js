import httpError from "../../utils/httpError.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/jwtToken.js";
import {
  getUserByEmail,
  getUserById,
  createUser,
  setUserVerified,
} from "./auth.repo.js";
import { sendEmail } from "../../utils/sendEmail.js";

const validateCredentials = (email, password) => {
  if (!email || !password) {
    throw new httpError(400, "Email and password are required");
  }
  if (typeof email !== "string" || typeof password !== "string") {
    throw new httpError(400, "Email and password must be strings");
  }
};

export const signInService = async (email, password) => {
  validateCredentials(email, password);
  const user = await getUserByEmail(email);
  if (!user) {
    throw new httpError(404, "User not found");
  }
  if (!bcrypt.compareSync(password, user.password)) {
    throw new httpError(401, "Invalid password");
  }
  if (user.isVerified === false) {
    const verificationToken = generateAccessToken({ email: user.email });
    await sendEmail(user.email, verificationToken);
    throw new httpError(
      403,
      "User not verified a verification email has been sent to your email address",
    );
  }
  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });
  return { accessToken, refreshToken };
};

export const signUpService = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new httpError(400, "Name, email, and password are required");
  }
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new httpError(400, "Name, email, and password must be strings");
  }

  const user = await getUserByEmail(email);
  if (user) {
    throw new httpError(409, "User already exists");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await createUser(name, email, hashedPassword);
  if (!newUser) {
    throw new httpError(500, "Unable to create user");
  }
  const verificationToken = generateAccessToken({ email: newUser.email });
  await sendEmail(newUser.email, verificationToken);
  return { verificationToken };
};

export const getMeService = (user) => {
  if (!user?.id || !user?.email) {
    throw new httpError(401, "Invalid authenticated user");
  }

  return {
    id: user.id,
    email: user.email,
  };
};

export const refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken || typeof refreshToken !== "string") {
    throw new httpError(401, "Refresh token is required");
  }
  const decoded = verifyToken(refreshToken);
  if (typeof decoded === "string" || !Number.isInteger(decoded.id)) {
    throw new httpError(401, "Invalid refresh token");
  }

  const user = await getUserById(decoded.id);
  if (!user) {
    throw new httpError(401, "User not found");
  }

  return generateAccessToken({ id: user.id, email: user.email });
};

export const verifyEmailService = async (token) => {
  if (!token || typeof token !== "string") {
    throw new httpError(400, "Verification token is required");
  }
  const decoded = verifyToken(token);
  if (typeof decoded === "string" || typeof decoded.email !== "string") {
    throw new httpError(400, "Invalid token");
  }
  const user = await setUserVerified(decoded.email);
  if (!user) {
    throw new httpError(404, "User not found");
  }
};