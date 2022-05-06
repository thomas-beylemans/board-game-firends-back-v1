-- Verify bgf:version_3 on pg

BEGIN;


SELECT "id", "name", "seats", "timestamp", "description", "admin", "geo_id", "created_at", "updated_at"
-- , "chatroom_id"
FROM "event";

SELECT "id", "name", "created_at", "updated_at"
FROM "game";

-- SELECT "id", "name", "username", "message", "created_at", "updated_at", "event_id"
-- FROM "chatroom";

-- check liaison table
-- SELECT "chatroom_id", "user_id"
-- FROM "user_chats_room";

SELECT "user_id", "event_id"
FROM "user_joins_event";

SELECT "user_id", "game_id"
FROM "user_owns_game";

ROLLBACK;
