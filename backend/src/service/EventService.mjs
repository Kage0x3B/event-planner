import { DatabaseManager } from '../database/DatabaseManager.mjs';
import { fixSqlDates, fixSqlDatesArray } from '../util/util.mjs';
import { SeatingPlanService } from './SeatingPlanService.mjs';

export class EventService {
  constructor () {
    this.seatingPlanService = new SeatingPlanService();
  }

  /**
   * Get a single event
   *
   * @return {import('../types/Event').Event[]}
   */
  listEvents () {
    /**
     * @type {import('../types/Event').Event[]}
     */
    const rawEvents = DatabaseManager.getDatabase().prepare('SELECT * FROM event').all();

    return fixSqlDatesArray(rawEvents, 'beginDate', 'createdAt');
  }

  /**
   * Get a single event
   *
   * @param {number} id the event id
   * @return {import('../types/Event').Event | undefined}
   */
  getEvent (id) {
    /**
     * @type {import('../types/Event').Event}
     */
    const rawEvent = DatabaseManager.getDatabase().prepare('SELECT * FROM event WHERE id = ?').get(id);

    return fixSqlDates(rawEvent, 'beginDate', 'createdAt');
  }

  /**
   * Create a new event
   *
   * @param {import('../types/Event').CreateEvent} data
   */
  createEvent (data) {
    const res = DatabaseManager.getDatabase().prepare(`INSERT INTO event (name, tableAmount, tableSeatAmount, seatingType, beginDate)
                                                       VALUES (?, ?, ?, ?,
                                                               ?)`).run(data.name, data.tableAmount, data.tableSeatAmount, data.seatingType, data.beginDate.toMillis());
    const eventId = res.lastInsertRowid;

    this.seatingPlanService.createSeats(eventId, data.tableAmount, data.tableSeatAmount);

    return eventId;
  }

  /**
   * Delete an event
   *
   * @param {number} id the event id
   * @return {void}
   */
  deleteEvent (id) {
    DatabaseManager.getDatabase().prepare('DELETE FROM seat_assignment WHERE eventId = ?').run(id);
    DatabaseManager.getDatabase().prepare('DELETE FROM seat WHERE eventId = ?').run(id);
    DatabaseManager.getDatabase().prepare('DELETE FROM guest WHERE eventId = ?').run(id);
    DatabaseManager.getDatabase().prepare('DELETE FROM event WHERE id = ?').run(id);
  }
}
