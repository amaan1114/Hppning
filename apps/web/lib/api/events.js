import api from "../axios";

export const getEvents = () => api.get("/events");

export const getEvent = (id) => api.get(`/events/${id}`);

export const createEvent = (event) => api.post("/events", event);
