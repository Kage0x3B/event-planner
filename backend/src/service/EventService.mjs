import { DatabaseManager } from '../database/DatabaseManager.mjs';
import { DateTime } from 'luxon';

export class EventService {
    /**
     * Get a single event
     *
     * @param id the event id
     * @return {import('../types/Event').Event | undefined}
     */
    getEvent(id) {
        const rawEvent = DatabaseManager.getDatabase().prepare('SELECT * FROM event WHERE id = ?').get(id);

        return {
            ...rawEvent,
            beginDate: DateTime.fromMillis(rawEvent.beginDate),
            createdAt: DateTime.fromSQL(rawEvent.createdAt)
        };
    }

    /**
     * Create a new event
     */
    createEvent(data) {
        const res = DatabaseManager.getDatabase().prepare(`INSERT INTO event (name, tableAmount, tableSeatAmount, seatingType, beginDate)
                                                           VALUES (?, ?, ?, ?,
                                                                   ?)`).run(data.name, data.tableAmount, data.tableSeatAmount, data.seatingType, data.beginDate);
        return res.lastInsertRowid;
    }
}
