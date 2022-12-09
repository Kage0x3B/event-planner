import { Server } from './Server.mjs';

async function initializeApplication() {
    const server = new Server();
    server.start();
}

initializeApplication().catch(err => {
    console.error(err);
    process.exit(1);
});
