import { Server } from './Server.mjs';
import { DatabaseManager } from './database/DatabaseManager.mjs';

async function initializeApplication () {
  await DatabaseManager.initDatabase();

  const server = new Server();
  server.start();
}

initializeApplication().catch(err => {
  console.error(err);
  process.exit(1);
});
