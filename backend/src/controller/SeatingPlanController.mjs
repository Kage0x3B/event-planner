import { AbstractController } from './AbstractController.mjs';
import express from 'express';
import { MissingPathParameterError } from '../util/RestError.mjs';
import { seatAssignmentSchema } from '../types/objectValidationSchemas.mjs';
import { SeatingPlanService } from '../service/SeatingPlanService.mjs';

export class SeatingPlanController extends AbstractController {
  constructor () {
    super();

    this.seatingPlanService = new SeatingPlanService();
  }

  /**
   * GET: /seatingPlan/:eventId
   *
   * @param {import('express').Request<{eventId: number | undefined}>} req
   * @return {import('../types/Seat').SeatingPlan}
   */
  getSeatingPlan (req) {
    const eventId = req.params.eventId;

    if (!eventId) {
      throw new MissingPathParameterError('eventId');
    }

    return this.seatingPlanService.getSeatingPlan(eventId);
  }

  /**
   * POST: /seatingPlan/:eventId
   *
   * @param req {import('express').Request<{}, void, import('../types/SeatAssignment').SeatAssignment>}
   * @return {void}
   */
  assignSeat (req) {
    this.seatingPlanService.assignSeat(req.body);
  }

  /**
   * DEL: /seatingPlan/:eventId/:seatNo
   *
   * @param {import('express').Request<{eventId: number | undefined; seatNo: number | undefined}>} req
   * @return {void}
   */
  deleteSeatAssignment (req) {
    const eventId = req.params.eventId;
    const seatNo = req.params.seatNo;

    if (!eventId) {
      throw new MissingPathParameterError('eventId');
    } else if (!seatNo) {
      throw new MissingPathParameterError('seatNo');
    }

    this.seatingPlanService.deleteSeatAssignment(eventId, seatNo);
  }

  getRouter () {
    const router = express.Router();

    router.delete('/:eventId/:seatNo', this.wrap(this.deleteSeatAssignment, { allowEmptyResponse: true }));
    router.get('/:eventId', this.wrap(this.getSeatingPlan));
    router.post('/', this.wrap(this.assignSeat, {
      allowEmptyResponse: true,
      bodyValidationSchema: seatAssignmentSchema
    }));

    return router;
  }

  getPath () {
    return '/seatingPlan';
  }
}
