import express from 'express';

export class Server {
    constructor() {
        this.app = express();
    }

    async start() {
        this.setupRoutes();
        this.setupStaticRoutes();
    }

    setupRoutes() {
        this.app.use('/event');
        this.app.get('/', (req, res) => {
            res.json({
                success: true
            });
        });
    }

    setupStaticRoutes() {
        this.app.use('/build', express.static('../frontend/build', {}));

        this.app.get('/*', (req, res) => {
            res.sendFile('../frontend/build/app.html');
        });
    }
}
