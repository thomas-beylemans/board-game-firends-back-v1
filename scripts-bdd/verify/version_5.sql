-- Verify bgf:version_5 on pg

BEGIN;

SELECT "event"."picture" FROM "event";

ROLLBACK;
