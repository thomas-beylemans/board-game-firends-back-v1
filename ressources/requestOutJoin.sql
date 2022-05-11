SELECT 
    "user"."id" AS "user_id",
    "user"."username",
    "user"."avatar",
    "user"."bio",
    "geo"."id" AS "geo_id",
    "geo"."city",
    "geo"."postcode",
    "geo"."lat",
    "geo"."long",
    "geo"."postcode",
    "event"."name" AS "event_name"
FROM
    "user"
    FULL OUTER JOIN "geo" ON ("geo"."id" = "geo_id")
    FULL OUTER JOIN "user_joins_event" ON ("user"."id" = "user_joins_event"."user_id")
    FULL OUTER JOIN "event" ON ("event"."id" = "user_joins_event"."event_id")
WHERE
    "user"."id" = 1;