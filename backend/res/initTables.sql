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
    id               integer                not null
        constraint guest_pk
            primary key autoincrement,
    eventId          integer                not null
        constraint guest_event_id_fk
            references event
            on update cascade on delete cascade,
    firstName        text                   not null,
    lastName         text                   not null,
    isChild          integer                not null,
    invitationStatus text default 'unknown' not null,
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
VALUES (1, 'Irgendeine Hochzeit (Beispiel-Daten)', 4, 4, 'oneSided', 1689858000000)
ON CONFLICT DO NOTHING;

INSERT INTO guest (id, eventId, firstName, lastName, isChild, invitationStatus)
VALUES (1, 1, 'Moritz', 'Hein', 0, 'confirmed') ON CONFLICT DO NOTHING;
INSERT INTO guest (id, eventId, firstName, lastName, isChild, invitationStatus)
VALUES (2, 1, 'C.', 'B.', 0, 'invited') ON CONFLICT DO NOTHING;
INSERT INTO guest (id, eventId, firstName, lastName, isChild, invitationStatus)
VALUES (3, 1, 'Peter', 'Tester', 0, 'declined') ON CONFLICT DO NOTHING;
INSERT INTO guest (id, eventId, firstName, lastName, isChild, invitationStatus)
VALUES (4, 1, 'Christina', 'Tester', 0, 'confirmed') ON CONFLICT DO NOTHING;
INSERT INTO guest (id, eventId, firstName, lastName, isChild, invitationStatus)
VALUES (5, 1, 'Alex', 'Tester', 1, 'confirmed') ON CONFLICT DO NOTHING;
INSERT INTO guest (id, eventId, firstName, lastName, isChild, invitationStatus)
VALUES (6, 1, 'Maria', 'Tester', 0, 'unknown') ON CONFLICT DO NOTHING;
INSERT INTO guest (id, eventId, firstName, lastName, isChild, invitationStatus)
VALUES (7, 1, 'Tina', 'Bagel', 0, 'confirmed') ON CONFLICT DO NOTHING;
INSERT INTO guest (id, eventId, firstName, lastName, isChild, invitationStatus)
VALUES (8, 1, 'Jonas', 'Tiger', 0, 'unknown') ON CONFLICT DO NOTHING;

INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 1, 1)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 2, 1)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 3, 1)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 4, 1)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 5, 2)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 6, 2)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 7, 2)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 8, 2)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 9, 3)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 10, 3)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 11, 3)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 12, 3)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 13, 4)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 14, 4)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 15, 4)
ON CONFLICT DO NOTHING;
INSERT INTO seat (eventId, seatNo, tableNo)
VALUES (1, 16, 4)
ON CONFLICT DO NOTHING;

INSERT INTO seat_assignment (eventId, seatNo, guestId)
VALUES (1, 1, 1) ON CONFLICT DO NOTHING;
INSERT INTO seat_assignment (eventId, seatNo, guestId)
VALUES (1, 2, 2) ON CONFLICT DO NOTHING;
