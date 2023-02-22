import { DatabaseManager } from '../database/DatabaseManager.mjs';

export class SeatingPlanService {
  /**
   * Create the database seat entries for an event
   *
   * @param {number} eventId
   * @param {number} tableAmount
   * @param {number} tableSeatAmount
   * @return {void}
   */
  createSeats (eventId, tableAmount, tableSeatAmount) {
    const seatInsertStatement = DatabaseManager.getDatabase().prepare(`INSERT INTO seat (eventId, seatNo, tableNo)
                                                                       VALUES (?, ?, ?)`);

    for (let tableNo = 1, seatNo = 1; tableNo <= tableAmount; tableNo++) {
      for (let tableSeatNo = 1; tableSeatNo <= tableSeatAmount; tableSeatNo++, seatNo++) {
        seatInsertStatement.run(eventId, seatNo, tableNo);
      }
    }
  }

  /**
   * (Re-)Assign a seat to a guest. Not a production-ready method to insert-or-update but good enough for this project.
   *
   * @param {import('../types/SeatAssignment').SeatAssignment} data
   * @return {void}
   */
  assignSeat (data) {
    /**
     * @type {import('../types/SeatAssignment').SeatAssignment}
     */
    const existingAssigment = DatabaseManager.getDatabase().prepare(`SELECT *
                                                                     FROM seat_assignment
                                                                     WHERE eventId = ?
                                                                       AND seatNo = ?`).get(data.eventId, data.seatNo);

    if (!existingAssigment) {
      DatabaseManager.getDatabase().prepare(`INSERT INTO seat_assignment (eventId, seatNo, guestId)
                                             VALUES (?, ?, ?)`).run(data.eventId, data.seatNo, data.guestId);
    } else if (existingAssigment && existingAssigment.guestId !== data.guestId) {
      DatabaseManager.getDatabase().prepare(`UPDATE seat_assignment
                                             SET guestId = ?
                                             WHERE eventId = ?
                                               AND seatNo = ?`).run(data.guestId, data.eventId, data.seatNo);
    }
  }

  /**
   * Delete a seat assignment.
   *
   * @param {number} eventId
   * @param {number} seatNo
   * @return {void}
   */
  deleteSeatAssignment (eventId, seatNo) {
    DatabaseManager.getDatabase().prepare(`DELETE
                                           FROM seat_assignment
                                           WHERE eventId = ?
                                             AND seatNo = ?`).run(eventId, seatNo);
  }
}
