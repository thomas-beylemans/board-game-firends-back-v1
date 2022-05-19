-- Deploy bgf:version_4 to pg


BEGIN;

-- INSERT INTO public.event(
--     "name", "seats", "start_date", "description", "event_admin", "geo_id" ) 
--     VALUES
--     ('Event 100', 7, '2022-05-04T18:00:00.000Z', 'Je ne joue pas pour participer, je joue pour que vous sachiez que je suis le meilleur !', 7, 6),
--     ('Event 27', 4, '2022-05-25T19:00:00.000Z', 'Super soirée où ça sera fun mais on ne sait pas quoi faire pour l\''instant...', 6, 7),
--     ('Event trop trop cool', 2, '2022-05-27T12:00:00.000Z', 'Une aprèm entière à faire des solitaires entre amis, ça te dit ?!', 7, 8),
--     ('Event pas si mal', 2, '2022-05-26T12:00:00.000Z', 'B;ab;;laskdg;lkasdg;lk; ladjg', 7, 9),
--     ('Grosse teuf', 2, '2022-05-29T12:00:00.000Z', 'mnvkjfsdnvkgjrrhg', 7, 10);

-- INSERT INTO public.game(
--     "name", "picture"  )
--     VALUES
--     ('Monopoly', 'https://cdn3.philibertnet.com/375938-large_default/monopoly-classique.jpg'),
--     ('Mystic Vale', 'https://cdn3.philibertnet.com/358209-large_default/mystic-vale.jpg'),
--     ('Dice Throne Adventures', 'https://cdn1.philibertnet.com/536883-medium_default/dice-throne-adventures.jpg');

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

-- INSERT INTO public.user_joins_event(
--     "user_id", "event_id" )
--     VALUES
--     (1, 1),
--     (1, 3),
--     (2, 1),
--     (3, 1),
--     (4, 1);

-- INSERT INTO public.user_owns_game(
-- "user_id", "game_id" )
-- VALUES
-- (1, 1),
-- (1, 2),
-- (1, 3),
-- (2, 2),
-- (3, 1),
-- (4, 1);

COMMIT;

