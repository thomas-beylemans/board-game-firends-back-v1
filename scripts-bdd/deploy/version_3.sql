-- Deploy bgf:version_3 to pg

BEGIN;

CREATE TABLE IF NOT EXISTS "event" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    "seats" int NOT NULL,
    "timestamp" timestamptz NOT NULL DEFAULT now(),
    "description" text NOT NULL,
    "admin" int NOT NULL REFERENCES "user"("id"),
    "geo_id" int NOT NULL REFERENCES "geo"("id"),
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "game" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text UNIQUE NOT NULL,
    -- "picture" varbinary(max),
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
    "user_id" int NOT NULL REFERENCES "user"("id"),
    "event_id" int NOT NULL REFERENCES "event"("id")
);

CREATE TABLE IF NOT EXISTS "user_owns_game" (
    "user_id" int NOT NULL REFERENCES "user"("id"),
    "game_id" int NOT NULL REFERENCES "game"("id")
);


COMMIT;
