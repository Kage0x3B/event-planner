export interface Event {
    id: number;
    name: string;
    tableAmount: number;
    tableSeatAmount: number;
    seatingType: 'oneSided' | 'bothSides';
    beginDate: number;
    createdAt: number;
}

export type CreateEvent = Pick<Event, 'name' | 'tableAmount' | 'tableSeatAmount' | 'seatingType' | 'beginDate'>;