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
   * @param {import('express').Request<{}, any, any, {start: number | undefined, amount: number | undefined}>} req
   * @return {import('../types/PaginatedResponse').PaginatedResponse<import('../types/Event').Event>}
   */
  listEvents (req) {
    const start = req.query.start ? Number(req.query.start) : 0;
    const amount = req.query.amount ? Number(req.query.amount) : 10;
    const paginatedEventList = this.eventService.listEvents({
      start,
      amount
    });
    const totalAmount = this.eventService.countEvents();

    return {
      start,
      amount,
      totalAmount,
      data: paginatedEventList
    };
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
