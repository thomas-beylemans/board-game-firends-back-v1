-- Deploy bgf:version_2 to pg

BEGIN;

INSERT INTO public.geo(
    "city", "postcode", "lat", "long" )
    VALUES
    ('Paris', 75000, 48.8589, 2.347),
    ('Montpellier', 34000, 43.61, 3.8742);

INSERT INTO public.user(
    "email", "password", "username", "avatar", "bio", "geo_id"  )
    VALUES
    ('tom@oclock.com', 'toto', 'Tom', 'https://res.cloudinary.com/board-game-friends/image/upload/v1652196952/images/kisspng-tom-cat-kitten-tom-and-jerry-talking-tom-and-frien-tom-and-jerry-5ac7adfeda7190.7836761415230356468948_lhogpv.jpg', 'dev junior', 1),
    ('tommy@oclock.com', 'toto', 'Tommy', 'https://res.cloudinary.com/board-game-friends/image/upload/v1652192466/images/logo-franchise-tommy-hilfiger_ziikbn.png', 'dev junior', 1),
    ('tommas@oclock.com', 'toto', 'Tommas', null, 'dev junior', 2),
    ('toas@oclock.com', 'toto', 'Toas', null, 'dev junior', 1);


COMMIT;
