-- Revert bgf:version_5 from pg

BEGIN;

ALTER TABLE "event"
    DROP COLUMN IF EXISTS "event_picture" CASCADE;

COMMIT;
