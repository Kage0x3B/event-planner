import { Server } from './Server.mjs';
import { DatabaseManager } from './database/DatabaseManager.mjs';
import { Settings } from 'luxon';

async function initializeApplication () {
  Settings.defaultZone = 'utc';
  await DatabaseManager.initDatabase();

  const server = new Server();
  server.start();
}

initializeApplication().catch(err => {
  console.error(err);
  process.exit(1);
});
