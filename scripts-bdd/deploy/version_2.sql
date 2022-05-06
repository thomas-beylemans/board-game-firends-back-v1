-- Deploy bgf:version_2 to pg

BEGIN;

INSERT INTO public.geo(
    "city", "state_number", "lat", "long" )
    VALUES
    ('Paris', '75000', 48.8589, 2.347),
    ('Montpellier', 34000, 43.61, 3.8742);

INSERT INTO public.user(
    "email", "password", "username", "bio", "geo_id"  )
    VALUES
    ('tom@oclock.com', 'toto', 'Tom', 'dev junior', 1),
    ('tommy@oclock.com', 'toto', 'Tommy', 'dev junior', 1),
    ('tommas@oclock.com', 'toto', 'Tommas', 'dev junior', 2),
    ('toas@oclock.com', 'toto', 'Toas', 'dev junior', 1);


COMMIT;
