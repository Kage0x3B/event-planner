import { Server } from './Server.js';

async function initializeApplication() {
    const server = new Server();
}

initializeApplication().catch(err => {
    console.error(err);
    process.exit(1);
});
