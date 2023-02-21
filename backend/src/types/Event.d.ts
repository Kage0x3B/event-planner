import { DateTime } from 'luxon';

export interface Event {
    id: number;
    name: string;
    tableAmount: number;
    tableSeatAmount: number;
    seatingType: 'oneSided' | 'bothSides';
    beginDate: DateTime;
    createdAt: DateTime;
}

export type CreateEvent = Pick<Event, 'name' | 'tableAmount' | 'tableSeatAmount' | 'seatingType' | 'beginDate'>;
