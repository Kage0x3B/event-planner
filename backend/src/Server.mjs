import express from 'express';
import { EventController } from './controller/EventController.mjs';
import config from './config.mjs';
import { logger } from './util/logger.mjs';
import { loggerMiddleware } from './middleware/loggerMiddleware.mjs';
import { resolveRelativeFilePath } from './util/util.mjs';

export class Server {
  constructor () {
    this.app = express();
    this.controllers = [new EventController()];
  }

  start () {
    this.setupMiddleware();
    this.setupApiRoutes();
    this.setupStaticRoutes();

    this.app.listen(config.PORT, config.HOST, () => {
      logger.info(`Listening on ${config.HOST}:${config.PORT}`);
    });
  }

  setupMiddleware () {
    this.app.use(loggerMiddleware);
    this.app.use(express.json());
  }

  setupApiRoutes () {
    for (const controller of this.controllers) {
      this.app.use(`/api${controller.getPath()}`, controller.getRouter());
    }

    this.app.use('/api/*', (req, res) => {
      res.sendStatus(404);
    });
  }

  setupStaticRoutes () {
    this.app.use('/build', express.static(resolveRelativeFilePath(import.meta.url, '../../../frontend/build'), {}));
    this.app.get('*', (req, res) => {
      res.sendFile(resolveRelativeFilePath(import.meta.url, '../../../frontend/build/index.html'));
    });
  }
}
