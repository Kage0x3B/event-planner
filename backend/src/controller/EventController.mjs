import { AbstractController } from './AbstractController.mjs';
import express from 'express';
import { EventService } from '../service/EventService.mjs';

export class EventController extends AbstractController {
    constructor() {
        super();

        this.eventService = new EventService();
    }

    /**
     * GET: /event/:eventId
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

    /**
     * POST: /event
     *
     * @param req {import('express').Request}
     * @param res {import('express').Response}
     */
    createEvent(req, res) {
        if (!req.body || !req.body.name?.length || !req.body.tableAmount || !req.body.tableSeatAmount || !req.body.seatingType || !req.body.beginDate) {
            return res.sendStatus(400);
        }

        const newEventId = this.eventService.createEvent(req.body);

        res.json({
            eventId: newEventId
        });
    }

    getRouter() {
        const router = express.Router();

        // This works without .bind(this) because the superclass performs autobinding
        router.post('/', this.createEvent);
        router.get('/:eventId', this.getEvent);

        return router;
    }

    getPath() {
        return '/event';
    }
}
