import { get, post } from './apiUtil.mjs';

/**
 * @return {Promise<import('backend/src/types/Event').Event[]>}
 */
function listEvents () {
  return get('/event');
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

export default {
  listEvents,
  getEvent,
  createEvent
};
