-- Revert bgf:version_3 from pg

BEGIN;

    -- ALTER TABLE "event" DROP COLUMN "chatroom_id";
    -- ALTER TABLE "chatroom" DROP COLUMN "event_id";

    DROP TABLE IF EXISTS 
    "game"
    , "event"
    -- , "chatroom"
    -- , "user_chats_room"
    , "user_joins_event"
    , "user_owns_game" CASCADE;

COMMIT;
