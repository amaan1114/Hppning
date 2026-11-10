import HttpError from "../../utils/httpError.js";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "./event.repo.js";

const eventFields = [
  "name",
  "description",
  "location",
  "date",
  "time",
];

const validateEventInput = (input, partial = false) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new HttpError(400, "Event data is required");
  }

  const values = {};
  for (const field of [...eventFields, "isActive"]) {
    if (input[field] !== undefined) values[field] = input[field];
  }

  if (!partial) {
    const missingField = eventFields.find(
      (field) => values[field] === undefined || values[field] === null,
    );
    if (missingField) throw new HttpError(400, `${missingField} is required`);
  }

  if (values.isActive !== undefined && typeof values.isActive !== "boolean") {
    throw new HttpError(400, "isActive must be a boolean");
  }

  for (const field of ["name", "description", "location", "date", "time"]) {
    if (values[field] !== undefined && typeof values[field] !== "string") {
      throw new HttpError(400, `${field} must be a string`);
    }
  }

  if (values.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
    throw new HttpError(400, "date must use YYYY-MM-DD format");
  }
  if (values.time !== undefined && !/^\d{2}:\d{2}(:\d{2})?$/.test(values.time)) {
    throw new HttpError(400, "time must use HH:mm or HH:mm:ss format");
  }

  return values;
};

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

export const createEventService = async (user, input) => {
  const adminId = getUserId(user);
  return createEvent({ ...validateEventInput(input), adminId });
};

export const getEventsService = () => getEvents();

export const getEventService = async (id) => {
  const event = await getEventById(getEventId(id));
  if (!event) throw new HttpError(404, "Event not found");
  return event;
};

export const updateEventService = async (user, id, input) => {
  const adminId = getUserId(user);
  const eventId = getEventId(id);
  const values = validateEventInput(input, true);
  if (Object.keys(values).length === 0) {
    throw new HttpError(400, "At least one event field is required");
  }

  const event = await updateEvent(eventId, adminId, values);
  if (event) return event;

  const existingEvent = await getEventById(eventId);
  throw new HttpError(
    existingEvent ? 403 : 404,
    existingEvent
      ? "Only the event admin can update this event"
      : "Event not found",
  );
};

export const deleteEventService = async (user, id) => {
  const adminId = getUserId(user);
  const eventId = getEventId(id);
  const event = await deleteEvent(eventId, adminId);
  if (event) return event;

  const existingEvent = await getEventById(eventId);
  throw new HttpError(
    existingEvent ? 403 : 404,
    existingEvent
      ? "Only the event admin can delete this event"
      : "Event not found",
  );
};