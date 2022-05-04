-- Deploy bgf:version_2 to pg

BEGIN;

INSERT INTO public.geo(
    "city", "state_number", "lat", "long" )
    VALUES
    ('Paris', '75000', '42', 42);

INSERT INTO public.user(
    "email", "password", "username", "bio", "geo_id"  )
    VALUES
    ('tom@oclock.com', 'toto', 'Tom', 'dev junior', 1);


COMMIT;
