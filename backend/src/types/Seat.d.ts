import { Guest } from './Guest';

export interface Seat {
    eventId: number;
    seatNo: number;
    tableNo: number;
}

export interface SeatWithGuest extends Seat {
    guest?: Guest;
}

/**
 * A seat with guest information indexed with the seatNo
 */
export type SeatingPlan = SeatWithGuest[];
