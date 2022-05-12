-- Deploy bgf:version_2 to pg

BEGIN;

INSERT INTO public.geo(
    "city", "postcode", "lat", "long" )
    VALUES
    ('Paris', 75000, 48.8589, 2.347),
    ('Montpellier', 34000, 43.61, 3.8742),
    ('Lyon', 69000, 45.76, 4.84),
    ('Marseille', 13000, 43.29, 5.36),
    ('Toulouse', 31000, 43.60, 1.44),
    ('Lattes', 34970, 43.567, 3.899),
    ('Villeneuve-lès-Maguelone', 34750, 43.5119, 3.8589),
    ('Palavas-les-Flots', 34250, 43.5323, 3.9346);


INSERT INTO public.user(
    "email", "password", "username", "avatar", "bio", "geo_id"  )
    VALUES
    ('tom@oclock.com', 'toto', 'Tom', 'https://res.cloudinary.com/board-game-friends/image/upload/v1652196952/images/kisspng-tom-cat-kitten-tom-and-jerry-talking-tom-and-frien-tom-and-jerry-5ac7adfeda7190.7836761415230356468948_lhogpv.jpg', 'dev junior', 1),
    ('tommy@oclock.com', 'toto', 'Tommy', 'https://res.cloudinary.com/board-game-friends/image/upload/v1652192466/images/logo-franchise-tommy-hilfiger_ziikbn.png', 'dev junior', 1),
    ('tommas@oclock.com', 'toto', 'Tommas', null, 'dev junior', 2),
    ('toas@oclock.com', 'toto', 'Toas', null, 'dev junior', 1),
    ('Chat10@oclock.com', 'toto', 'Chat10', 'https://cdn.pixabay.com/photo/2016/06/14/00/14/cat-1455468_960_720.jpg', 'Description de Chat10', 5),
    ('Chat71@oclock.com', 'toto', 'Chat71', 'https://cdn.pixabay.com/photo/2012/02/27/16/57/cat-17430_960_720.jpg', 'Description de Chat71', 4),
    ('GriffeurDu34@oclock.com', 'toto', 'GriffeurDu34', 'https://cdn.pixabay.com/photo/2015/01/04/10/46/lion-588144_960_720.jpg', 'Description de GriffeurDu34', 2);    


COMMIT;
