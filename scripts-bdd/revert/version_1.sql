-- Revert bgf:version_1 from pg

BEGIN;

DROP TABLE IF EXISTS "geo", "user" CASCADE;

COMMIT;
