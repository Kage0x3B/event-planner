import { DatabaseManager } from '../database/DatabaseManager.mjs';
import { fixSqlDates, fixSqlDatesArray } from '../util/util.mjs';

export class EventService {
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
   * @param id the event id
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
    return res.lastInsertRowid;
  }
}
