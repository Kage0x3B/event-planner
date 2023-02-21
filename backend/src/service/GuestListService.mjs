import { DatabaseManager } from '../database/DatabaseManager.mjs';

export class GuestListService {
  /**
   * List all guests of an event
   *
   * @param {number} eventId the event id
   * @return {import('../types/Guest').Guest[]}
   */
  listGuests (eventId) {
    return DatabaseManager.getDatabase().prepare('SELECT * FROM guest WHERE eventId = ? ORDER BY lastName, firstName').all(eventId);
  }

  /**
   * Create a new guest
   *
   * @param {import('../types/Guest').CreateGuest} data
   */
  createGuest (data) {
    DatabaseManager.getDatabase().prepare(`INSERT INTO guest (eventId, firstName, lastName, isChild)
                                           VALUES (?, ?, ?,
                                                   ?)`).run(data.eventId, data.firstName, data.lastName, Number(data.isChild));
  }

  /**
   * Update the invitation status of a guest
   *
   * @param {import('../types/Guest').UpdateInvitationStatus} data
   */
  updateInvitationStatus (data) {
    DatabaseManager.getDatabase().prepare(`UPDATE guest
                                           SET invitationStatus = ?
                                           WHERE id = ?`).run(data.invitationStatus, data.id);
  }

  /**
   * Delete a guest
   *
   * @param {number} id the event id
   * @return {void}
   */
  deleteGuest (id) {
    DatabaseManager.getDatabase().prepare('DELETE FROM seat_assignment WHERE guestId = ?').run(id);
    DatabaseManager.getDatabase().prepare('DELETE FROM guest WHERE id = ?').run(id);
  }
}
