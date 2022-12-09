import { AbstractController } from './AbstractController.mjs';
import express from 'express';

export class EventController extends AbstractController {
    /**
     * @param req {import('express').Request}
     * @param res {import('express').Response}
     */
    getEvent(req, res) {
        console.log('get event route');
    }

    getRouter() {
        const router = express.Router();

        router.get('/', this.getEvent);

        return router;
    }

    getPath() {
        return '/event';
    }
}
