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
    this.deleteSeatAssignmentForGuest(data.guestId);

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
   * Get a single event
   *
   * @param {number} eventId the event id
   * @return {import('../types/Seat').SeatingPlan}
   */
  getSeatingPlan (eventId) {
    /** @type {(import('../types/Seat').Seat & import('../types/Guest').Guest & { guestId?: number })[]} */
    const rawSeatingPlan = DatabaseManager.getDatabase().prepare(`SELECT s.eventId,
                                                                         s.seatNo,
                                                                         s.tableNo,
                                                                         sa.guestId,
                                                                         g.firstName,
                                                                         g.lastName,
                                                                         g.isChild,
                                                                         g.invitationStatus
                                                                  FROM seat s
                                                                           LEFT JOIN seat_assignment sa on s.eventId = sa.eventId and s.seatNo = sa.seatNo
                                                                           LEFT JOIN guest g on sa.guestId = g.id
                                                                  WHERE s.eventId = ?;
    `).all(eventId);

    /** @type {SeatingPlan} */
    const seatingPlanArray = [];

    for (const entry of rawSeatingPlan) {
      seatingPlanArray[entry.seatNo] = {
        eventId: entry.eventId,
        seatNo: entry.seatNo,
        tableNo: entry.tableNo,
        guest: (entry.guestId) ? {
          id: entry.guestId,
          firstName: entry.firstName,
          lastName: entry.lastName,
          isChild: Boolean(entry.isChild),
          invitationStatus: entry.invitationStatus
        } : null
      };
    }

    return seatingPlanArray;
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

  /**
   * Delete a seat assignment for a guest id.
   *
   * @param {number} guestId
   * @return {void}
   */
  deleteSeatAssignmentForGuest (guestId) {
    DatabaseManager.getDatabase().prepare(`DELETE
                                           FROM seat_assignment
                                           WHERE guestId = ?`).run(guestId);
  }
}
