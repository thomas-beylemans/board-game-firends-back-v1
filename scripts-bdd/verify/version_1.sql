-- Verify bgf:version_1 on pg

BEGIN;

SELECT "id", "city", "postcode", "lat", "long", "created_at", "updated_at"
FROM "geo";

SELECT "id", "email", "password", "username", "avatar", "bio", "geo_id", "created_at", "updated_at"
FROM "user";

ROLLBACK;
