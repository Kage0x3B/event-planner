import { del, get, post } from './apiUtil.mjs';

/**
 * @param {number} eventId
 * @return {Promise<import('backend/src/types/Guest').Guest[]>}
 */
function listGuests (eventId) {
  return get(`/guest/list/${eventId}`);
}

/**
 * @param {import('backend/src/types/Guest').CreateGuest} data
 * @return {Promise<void>}
 */
function createGuest (data) {
  return post('/guest', data);
}

/**
 @param {import('backend/src/types/Guest').UpdateInvitationStatus} data
 * @return {Promise<void>}
 */
function updateInvitationStatus (data) {
  return post('/guest/updateInvitationStatus', data);
}

/**
 @param {number} guestId
 * @return {Promise<void>}
 */
function deleteGuest (guestId) {
  return del(`/guest/${guestId}`);
}

export default {
  listGuests,
  createGuest,
  updateInvitationStatus,
  deleteGuest
};
