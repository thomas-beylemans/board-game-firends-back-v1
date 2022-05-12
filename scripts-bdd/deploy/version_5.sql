-- Deploy bgf:version_5 to pg

BEGIN;

ALTER TABLE "event"
    ADD COLUMN "picture" TEXT;

UPDATE
    "event"
SET
    "picture" = ('http://www.spainisculture.com/export/sites/cultura/multimedia/galerias/fiestas/fiestas_sin_ficha/ajedrez2_javea_o_c.jpg_1306973099.jpg')
WHERE
    "id" = 1;

UPDATE
    "event"
SET
    "picture" = ('https://d2lv662meabn0u.cloudfront.net/boomerang/dynamic/editorial/00000000/421/1665670a7d1dc8574f071cb6aaeef85deb66c291_1589991670.webp')
WHERE
    "id" = 2;

UPDATE
    "event"
SET
    "picture" = ('https://cache.magazine-avantages.fr/data/photo/w1000_ci/1jv/cartes-a-jouer-diy-do-it-yourself.jpg')
WHERE
    "id" = 3;

COMMIT;
