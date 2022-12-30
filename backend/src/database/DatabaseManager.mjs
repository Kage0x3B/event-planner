import Database from 'better-sqlite3';
import { logger } from '../util/logger.mjs';
import fs from 'fs/promises';
import { resolveRelativeFilePath } from '../util/util.mjs';

export class DatabaseManager {
  /**
   * @private
   * @type {import('better-sqlite3')}
   */
  static databaseInstance;

  static async initDatabase () {
    logger.info('Initializing database');
    DatabaseManager.databaseInstance = new Database('./eventdata.sqlite');
    DatabaseManager.databaseInstance.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md

    logger.info('Creating database tables if they don\'t exist yet');
    await DatabaseManager.initTables();
    logger.info('Database initialized!');
  }

  static async initTables () {
    const initializeDatabaseSql = await fs.readFile(resolveRelativeFilePath(import.meta.url, '../../../res/initTables.sql'), { encoding: 'utf-8' });
    this.getDatabase().exec(initializeDatabaseSql);
  }

  /**
   * @return {import('better-sqlite3')}
   */
  static getDatabase () {
    return DatabaseManager.databaseInstance;
  }
}
