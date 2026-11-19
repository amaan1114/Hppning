import api from "../axios";

export const getMyRegistrations = () => api.get("/registrations/me");

export const register = (eventId) => api.post(`/registrations/${eventId}`);

export const unregister = (eventId) => api.delete(`/registrations/${eventId}`);

// Admin only: who registered for an event
export const getEventRegistrations = (eventId) =>
  api.get(`/registrations/event/${eventId}`);
