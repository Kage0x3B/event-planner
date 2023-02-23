import { del, get, post } from './apiUtil.mjs';

/**
 * @return {Promise<import('backend/src/types/PaginatedResponse').PaginatedResponse<import('backend/src/types/Event').Event>>}
 */
function listEvents ({ start = 0, amount = 10 }) {
  return get(`/event?${new URLSearchParams({
    start, amount
  })}`);
}

/**
 * @param {number} eventId
 * @return {Promise<import('backend/src/types/Event').Event>}
 */
function getEvent (eventId) {
  return get(`/event/${eventId}`);
}

/**
 * @param {import('backend/src/types/Event').CreateEvent} data
 * @return {Promise<{eventId: number}>}
 */
function createEvent (data) {
  return post('/event', data);
}

/**
 @param {number} eventId
 * @return {Promise<void>}
 */
function deleteEvent (eventId) {
  return del(`/event/${eventId}`);
}

export default {
  listEvents,
  getEvent,
  createEvent,
  deleteEvent
};
