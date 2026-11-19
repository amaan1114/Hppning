import express from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  getEventRegistrationsController,
  getMyRegistrationsController,
  registerController,
  unregisterController,
} from "./registration.controller.js";

const registrationRouter = express.Router();

registrationRouter.use(authMiddleware);

registrationRouter.get("/me", getMyRegistrationsController);
registrationRouter.get("/event/:eventId", getEventRegistrationsController);
registrationRouter.post("/:eventId", registerController);
registrationRouter.delete("/:eventId", unregisterController);

export default registrationRouter;
