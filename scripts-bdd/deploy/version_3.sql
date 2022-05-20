-- Deploy bgf:version_3 to pg

BEGIN;

CREATE TABLE IF NOT EXISTS "event" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    "seats" int NOT NULL,
    "start_date" timestamptz NOT NULL,
    "description" text NOT NULL,
    "event_admin" int NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "geo_id" int NOT NULL REFERENCES "geo"("id"),
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "game" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text UNIQUE NOT NULL,
    "picture" text,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE IF NOT EXISTS "chatroom" (
--     "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     "name" text NOT NULL,
--     "username" text NOT NULL,
--     "message" text NOT NULL,
--     "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );


    -- ALTER TABLE "event" ADD COLUMN "chatroom_id" int NOT NULL DEFAULT '0000';

    -- ALTER TABLE "chatroom" ADD COLUMN "event_id" int NOT NULL DEFAULT '0000';


-- tables de liaison

-- CREATE TABLE IF NOT EXISTS "user_chats_room" (
--     "chatroom_id" int NOT NULL REFERENCES "chatroom"("id"),
--     "user_id" int NOT NULL REFERENCES "user"("id")
-- );

CREATE TABLE IF NOT EXISTS "user_joins_event" (
    "user_id" int NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "event_id" int NOT NULL REFERENCES "event"("id") ON DELETE CASCADE,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("user_id", "event_id")
);

CREATE TABLE IF NOT EXISTS "user_owns_game" (
    "user_id" int NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "game_id" int NOT NULL REFERENCES "game"("id") ON DELETE CASCADE,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("user_id", "game_id")
);


COMMIT;
