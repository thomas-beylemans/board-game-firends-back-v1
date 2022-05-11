-- Verify bgf:version_5 on pg

BEGIN;

SELECT "event"."event_picture" FROM "event";

ROLLBACK;
