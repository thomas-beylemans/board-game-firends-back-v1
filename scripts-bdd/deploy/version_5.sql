-- Deploy bgf:version_5 to pg

BEGIN;

ALTER TABLE "event"
    ADD COLUMN "event_picture" TEXT;

COMMIT;
