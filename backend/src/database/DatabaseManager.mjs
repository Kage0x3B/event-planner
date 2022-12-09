import Database from 'better-sqlite3';

export class DatabaseManager {
    /**
     * @type {import('better-sqlite3').Database}
     */
    static databaseInstance;

    static initDatabase() {
        DatabaseManager.databaseInstance = new Database('./eventdata.sqlite');
        DatabaseManager.databaseInstance.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
    }

    /**
     * @return {import('better-sqlite3').Database}
     */
    static getDatabase() {
        return DatabaseManager.databaseInstance;
    }
}
