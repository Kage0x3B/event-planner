import { AbstractController } from './AbstractController.mjs';
import express from 'express';
import { MissingPathParameterError } from '../util/RestError.mjs';
import { createGuestSchema, updateInvitationStatusSchema } from '../types/objectValidationSchemas.mjs';
import { GuestListService } from '../service/GuestListService.mjs';

export class GuestController extends AbstractController {
  constructor () {
    super();

    this.guestListService = new GuestListService();
  }

  /**
   * GET: /guest/list/:eventId
   *
   * @param {import('express').Request<{eventId: number | undefined}>} req
   * @return {import('../types/Guest').Guest[]}
   */
  listGuests (req) {
    const eventId = req.params.eventId;

    if (!eventId) {
      throw new MissingPathParameterError('eventId');
    }

    return this.guestListService.listGuests(eventId);
  }

  /**
   * POST: /guest
   *
   * @param req {import('express').Request<{}, void, import('../types/Guest').CreateGuest>}
   * @return {void}
   */
  createGuest (req) {
    this.guestListService.createGuest(req.body);
  }

  /**
   * POST: /guest/updateInvitationStatus
   *
   * @param req {import('express').Request<{}, void, import('../types/Guest').UpdateInvitationStatus>}
   * @return {void}
   */
  updateInvitationStatus (req) {
    this.guestListService.updateInvitationStatus(req.body);
  }

  /**
   * DEL: /guest/:guestId
   *
   * @param {import('express').Request<{guestId: number | undefined}>} req
   * @return {void}
   */
  deleteGuest (req) {
    const guestId = req.params.guestId;

    if (!guestId) {
      throw new MissingPathParameterError('guestId');
    }

    this.guestListService.deleteGuest(guestId);
  }

  getRouter () {
    const router = express.Router();

    router.delete('/:guestId', this.wrap(this.deleteGuest, { allowEmptyResponse: true }));
    router.get('/list/:eventId', this.wrap(this.listGuests));
    router.post('/', this.wrap(this.createGuest, {
      allowEmptyResponse: true,
      bodyValidationSchema: createGuestSchema
    }));
    router.post('/updateInvitationStatus', this.wrap(this.updateInvitationStatus, {
      allowEmptyResponse: true,
      bodyValidationSchema: updateInvitationStatusSchema
    }));

    return router;
  }

  getPath () {
    return '/guest';
  }
}
