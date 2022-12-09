import express from 'express';
import path from 'path';
import { EventController } from './controller/EventController.mjs';
import config from './config.mjs';
import { logger } from './util/logger.mjs';
import { loggerMiddleware } from './middleware/loggerMiddleware.mjs';

export class Server {
    constructor() {
        this.app = express();
        this.controllers = [new EventController()];
    }

    start() {
        this.setupMiddleware();
        this.setupApiRoutes();
        this.setupStaticRoutes();

        this.app.listen(config.PORT, config.HOST, () => {
            logger.info(`Listening on ${config.HOST}:${config.PORT}`);
        });
    }

    setupMiddleware() {
        this.app.use(loggerMiddleware);
        this.app.use(express.json());
    }

    setupApiRoutes() {
        for (const controller of this.controllers) {
            console.log('registering on ', controller.getPath());
            this.app.use(`/api${controller.getPath()}`, controller.getRouter());
        }
    }

    setupStaticRoutes() {
        let currentDirectory = import.meta.url;

        if (currentDirectory.startsWith('file://')) {
            currentDirectory = currentDirectory.substring('file://'.length);
        }

        this.app.use('/build', express.static(path.join(currentDirectory, '../../../frontend/build'), {}));
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(currentDirectory, '../../../frontend/build/index.html'));
        });
    }
}
