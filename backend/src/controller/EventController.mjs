import { AbstractController } from './AbstractController.mjs';
import express from 'express';
import { EventService } from '../service/EventService.mjs';
import { MissingPathParameterError } from '../util/RestError.mjs';
import { createEventSchema } from '../types/objectValidationSchemas.mjs';

export class EventController extends AbstractController {
  constructor () {
    super();

    this.eventService = new EventService();
  }

  /**
   * GET: /event
   *
   * @return {import('../types/Event').Event[]}
   */
  listEvents () {
    return this.eventService.listEvents();
  }

  /**
   * GET: /event/:eventId
   *
   * @param {import('express').Request<{eventId: number | undefined}>} req
   * @return {import('../types/Event').Event}
   */
  getEvent (req) {
    const eventId = req.params.eventId;

    if (!eventId) {
      throw new MissingPathParameterError('eventId');
    }

    return this.eventService.getEvent(eventId);
  }

  /**
   * POST: /event
   *
   * @param req {import('express').Request<unknown, void, import('../types/Event').Event>}
   * @return {{eventId: number}}
   */
  createEvent (req) {
    const newEventId = this.eventService.createEvent(req.body);

    return {
      eventId: newEventId
    };
  }

  /**
   * DEL: /event/:eventId
   *
   * @param {import('express').Request<{eventId: number | undefined}>} req
   * @return {void}
   */
  deleteEvent (req) {
    const eventId = req.params.eventId;

    if (!eventId) {
      throw new MissingPathParameterError('eventId');
    }

    this.eventService.deleteEvent(eventId);
  }

  getRouter () {
    const router = express.Router();

    // This works without .bind(this) because the superclass performs autobinding
    router.delete('/:eventId', this.wrap(this.deleteEvent, { allowEmptyResponse: true }));
    router.get('/:eventId', this.wrap(this.getEvent));
    router.post('/', this.wrap(this.createEvent, { bodyValidationSchema: createEventSchema }));
    router.get('/', this.wrap(this.listEvents));

    return router;
  }

  getPath () {
    return '/event';
  }
}
