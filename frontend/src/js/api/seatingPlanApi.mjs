import { del, get, post } from './apiUtil.mjs';
import { number } from 'yup';

/**
 * @param {number} eventId
 * @return {Promise<import('backend/src/types/Seat').SeatingPlan>}
 */
function getSeatingPlan (eventId) {
  return get(`/seatingPlan/${eventId}`);
}

/**
 * @param {import('backend/src/types/SeatAssignment').SeatAssignment} data
 * @return {Promise<void>}
 */
function assignSeat (data) {
  return post(`/seatingPlan`, data);
}

/**
 @param {number} eventId
 @param {number} seatNo
 * @return {Promise<void>}
 */
function deleteSeatAssignment (eventId, seatNo) {
  return del(`/seatingPlan/${eventId}/${seatNo}`);
}

export default {
  getSeatingPlan,
  assignSeat,
  deleteSeatAssignment
};
