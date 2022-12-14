create table if not exists event
(
    id              integer                           not null
        constraint event_pk
            primary key autoincrement,
    name            integer,
    tableAmount     integer                           not null,
    tableSeatAmount integer                           not null,
    seatingType     text                              not null,
    beginDate       integer                           not null,
    createdAt       integer default CURRENT_TIMESTAMP not null,
    constraint seatingTypeEnum
        check (seatingType = 'oneSided' OR seatingType = 'bothSides')
);

create table if not exists guest
(
    id               integer not null
        constraint guest_pk
            primary key,
    eventId          integer not null
        constraint guest_event_id_fk
            references event
            on update cascade on delete cascade,
    firstName        text    not null,
    lastName         text    not null,
    isChild          integer not null,
    invitationStatus text    not null,
    constraint invitationStatusEnum
        check (invitationStatus = 'unknown' OR invitationStatus = 'invited' OR invitationStatus = 'confirmed' OR
               invitationStatus = 'declined')
);

create table if not exists seat
(
    eventId integer not null
        constraint seat_event_id_fk
            references event
            on update cascade on delete cascade,
    seatNo  integer not null,
    tableNo integer,
    constraint seat_pk
        primary key (eventId, seatNo)
);

create table if not exists seat_assignment
(
    eventId integer not null,
    seatNo  integer not null,
    guestId integer not null
        constraint seat_assignment_guest_id_fk
            references guest
            on update cascade on delete cascade,
    constraint seat_assignment_pk
        primary key (eventId, seatNo),
    constraint seat_assignment_pk2
        unique (eventId, guestId),
    constraint seat_assignment_seat_eventId_seatNo_fk
        foreign key (eventId, seatNo) references seat
            on update cascade on delete cascade
);


/* === TEST DATA === */

INSERT INTO event (id, name, tableAmount, tableSeatAmount, seatingType, beginDate)
VALUES (1, 'Moritz Test Event', 8, 4, 'oneSided', CURRENT_TIMESTAMP + 1000 * 60 * 60 * 24)
ON CONFLICT DO NOTHING;
