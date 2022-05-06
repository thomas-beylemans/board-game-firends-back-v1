-- Deploy bgf:version_4 to pg


BEGIN;

INSERT INTO public.event(
    "name", "seats", "timestamp", "description", "admin", "geo_id" ) 
    VALUES
    ('BoardGameEvent Bordeaux', 100, '2022-05-06 11:59:52.675661+02', 'Biggest event in France', '1', 1);

INSERT INTO public.game(
    "name"  )
    VALUES
    ('the best BG of Earth'),
    ('the BG of Earth'),
    ('the BG');

-- INSERT INTO public.chatroom(
--     "name", "username", "message"  )
--     VALUES
--     ('chat_1', 'toto', 'Hello World'),
--     ('chat_1', 'first', 'Holà'),
--     ('chat_1', 'second', 'Ola'),
--     ('chat_1', 'first', 'Que tal?'),
--     ('chat_1', 'second', 'Muy bien y tu? como estas?');

-- INSERT INTO public.user_chats_room(
--     "chatroom_id", "user_id" )
--     VALUES
--     (1, 1),
--     (1, 2),
--     (1, 1),
--     (1, 2);

INSERT INTO public.user_joins_event(
    "user_id", "event_id" )
    VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1);

INSERT INTO public.user_owns_game(
"user_id", "game_id" )
VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 2),
(3, 1),
(4, 1);

COMMIT;

