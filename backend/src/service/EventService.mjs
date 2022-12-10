import { DatabaseManager } from '../database/DatabaseManager.mjs';

export class EventService {
    /**
     * Get a single event
     *
     * @param id the event id
     * @return {import('../types/Event').Event | undefined}
     */
    getEvent(id) {
        return DatabaseManager.getDatabase().prepare('SELECT * FROM event WHERE id = ?').get(id);
    }
}
