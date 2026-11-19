import { httpResponse } from "../../utils/httpResponse.js";
import {
  getEventRegistrationsService,
  getMyRegistrationsService,
  registerService,
  unregisterService,
} from "./registration.service.js";

export const registerController = async (req, res, next) => {
  try {
    const registration = await registerService(req.user, req.params.eventId);
    return httpResponse(true, res, req, 201, "Registered Successfully", registration);
  } catch (error) {
    next(error);
  }
};

export const unregisterController = async (req, res, next) => {
  try {
    const registration = await unregisterService(req.user, req.params.eventId);
    return httpResponse(true, res, req, 200, "Registration Cancelled", registration);
  } catch (error) {
    next(error);
  }
};

export const getMyRegistrationsController = async (req, res, next) => {
  try {
    const registrations = await getMyRegistrationsService(req.user);
    return httpResponse(true, res, req, 200, "Registrations Retrieved Successfully", registrations);
  } catch (error) {
    next(error);
  }
};

export const getEventRegistrationsController = async (req, res, next) => {
  try {
    const registrations = await getEventRegistrationsService(req.user, req.params.eventId);
    return httpResponse(true, res, req, 200, "Event Registrations Retrieved Successfully", registrations);
  } catch (error) {
    next(error);
  }
};
