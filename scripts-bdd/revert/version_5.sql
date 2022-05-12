-- Revert bgf:version_5 from pg

BEGIN;

ALTER TABLE "event"
    DROP COLUMN IF EXISTS "picture" CASCADE;

COMMIT;
