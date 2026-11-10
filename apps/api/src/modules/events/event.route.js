import express from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  createEventController,
  deleteEventController,
  getEventController,
  getEventsController,
  updateEventController,
} from "./event.controller.js";

const eventRouter = express.Router();

eventRouter.get("/", getEventsController);
eventRouter.get("/:id", getEventController);
eventRouter.post("/", authMiddleware, createEventController);
eventRouter.patch("/:id", authMiddleware, updateEventController);
eventRouter.put("/:id", authMiddleware, updateEventController);
eventRouter.delete("/:id", authMiddleware, deleteEventController);

export default eventRouter;