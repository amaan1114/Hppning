import express from "express";
import {
  signUpController,
  signInController,
  signOutController,
  getMeController,
  verifyEmailController,
  refreshTokenController,
} from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";

const authrouter = express.Router();

authrouter.post("/signup", signUpController);
authrouter.post("/signin", signInController);
authrouter.post("/signout", signOutController);
authrouter.get("/me", authMiddleware, getMeController);
authrouter.post("/verify-email", verifyEmailController);
authrouter.post("/refresh", refreshTokenController);

export default authrouter;
