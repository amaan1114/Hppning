import HttpError from "../../utils/httpError.js";
import { getEventById } from "../events/event.repo.js";
import {
  createRegistration,
  deleteRegistration,
  getRegistrationsByEvent,
  getRegistrationsByUser,
} from "./registration.repo.js";

const getUserId = (user) => {
  const userId = Number(user?.id);
  if (!Number.isInteger(userId)) {
    throw new HttpError(401, "Invalid authenticated user");
  }
  return userId;
};

const getEventId = (id) => {
  const eventId = Number(id);
  if (!Number.isInteger(eventId) || eventId < 1) {
    throw new HttpError(400, "Invalid event id");
  }
  return eventId;
};

export const registerService = async (user, id) => {
  const userId = getUserId(user);
  const eventId = getEventId(id);

  const event = await getEventById(eventId);
  if (!event) throw new HttpError(404, "Event not found");
  if (!event.isActive) throw new HttpError(400, "Event is not active");

  const registration = await createRegistration(userId, eventId);
  if (!registration) throw new HttpError(409, "Already registered");
  return registration;
};

export const unregisterService = async (user, id) => {
  const registration = await deleteRegistration(getUserId(user), getEventId(id));
  if (!registration) throw new HttpError(404, "Registration not found");
  return registration;
};

export const getMyRegistrationsService = (user) =>
  getRegistrationsByUser(getUserId(user));

// Only the admin who created the event can see who registered
export const getEventRegistrationsService = async (user, id) => {
  const userId = getUserId(user);
  const eventId = getEventId(id);

  const event = await getEventById(eventId);
  if (!event) throw new HttpError(404, "Event not found");
  if (event.adminId !== userId) {
    throw new HttpError(403, "Only the event admin can view registrations");
  }

  return getRegistrationsByEvent(eventId);
};
