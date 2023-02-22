import { Guest } from './Guest';

export interface Seat {
    eventId: number;
    seatNo: number;
    tableNo: number;
}

export interface SeatWithGuest extends Partial<Pick<Guest, 'id' | 'firstName' | 'lastName' | 'isChild'>> {
    eventId: number;
    seatNo: number;
    tableNo: number;
    guestId: number | undefined;
}
