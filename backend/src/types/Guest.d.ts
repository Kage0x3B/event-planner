export interface Guest {
    id: number;
    eventId: number;
    firstName: string;
    lastName: string;
    isChild: boolean;
    invitationStatus: 'unknown' | 'invited' | 'confirmed' | 'declined';
}

export type CreateGuest = Pick<Guest, 'eventId' | 'firstName' | 'lastName' | 'isChild' | 'invitationStatus'>;