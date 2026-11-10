import { httpResponse } from "../../utils/httpResponse.js";
import {
  createEventService,
  deleteEventService,
  getEventService,
  getEventsService,
  updateEventService,
} from "./event.service.js";

export const createEventController = async (req, res, next) => {
  try {
    const event = await createEventService(req.user, req.body);
    return httpResponse(true, res, req, 201, "Event Created Successfully", event);
  } catch (error) {
    next(error);
  }
};

export const getEventsController = async (req, res, next) => {
  try {
    const events = await getEventsService();
    return httpResponse(true, res, req, 200, "Events Retrieved Successfully", events);
  } catch (error) {
    next(error);
  }
};

export const getEventController = async (req, res, next) => {
  try {
    const event = await getEventService(req.params.id);
    return httpResponse(true, res, req, 200, "Event Retrieved Successfully", event);
  } catch (error) {
    next(error);
  }
};

export const updateEventController = async (req, res, next) => {
  try {
    const event = await updateEventService(req.user, req.params.id, req.body);
    return httpResponse(true, res, req, 200, "Event Updated Successfully", event);
  } catch (error) {
    next(error);
  }
};

export const deleteEventController = async (req, res, next) => {
  try {
    const event = await deleteEventService(req.user, req.params.id);
    return httpResponse(true, res, req, 200, "Event Deleted Successfully", event);
  } catch (error) {
    next(error);
  }
};