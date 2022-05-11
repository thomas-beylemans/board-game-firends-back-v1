-- Deploy bgf:version_1 to pg

BEGIN;

CREATE TABLE IF NOT EXISTS "geo" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "city" text NOT NULL,
    "postcode" int NOT NULL,
    "lat" float NOT NULL,
    "long" float NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "user" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" text UNIQUE NOT NULL,
    "password" text NOT NULL,
    "username" text UNIQUE NOT NULL,
    "avatar" text,
    "bio" text,
    "geo_id" int NOT NULL REFERENCES "geo"("id"),
    "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
