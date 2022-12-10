import { AbstractController } from './AbstractController.mjs';
import express from 'express';
import { EventService } from '../service/EventService.mjs';

export class EventController extends AbstractController {
    constructor() {
        super();

        this.eventService = new EventService();
    }

    /**
     * Path: /event/:eventId
     *
     * @param req {import('express').Request}
     * @param res {import('express').Response}
     */
    getEvent(req, res) {
        const eventId = req.params.eventId;

        if (!eventId) {
            return res.sendStatus(400);
        }

        res.json(this.eventService.getEvent(eventId));
    }

    getRouter() {
        const router = express.Router();

        // This works without .bind(this) because the superclass performs autobinding
        router.get('/:eventId', this.getEvent);

        return router;
    }

    getPath() {
        return '/event';
    }
}
