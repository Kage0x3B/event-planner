create table if not exists event
(
    id         integer                           not null
        constraint event_pk
            primary key autoincrement,
    name       integer,
    created_at integer default CURRENT_TIMESTAMP not null
);

/* === TEST DATA === */

INSERT INTO event (id, name)
VALUES (1, 'Moritz Test Event')
ON CONFLICT DO NOTHING;
