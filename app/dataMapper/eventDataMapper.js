const pool = require('../database/dbClient');
const toolsDataMapper = require('./toolsDataMapper')

const eventDataMapper = {
    async getEvents(userProfile, zoomFactor = 1){
        const query = {
            text: `SELECT
                "event"."id",
                "event"."name",
                "event"."picture",
                "event"."seats",
                "event"."start_date",
                "event"."description",
                "event"."created_at",
                "geo"."id" AS "geo_id",
                "geo"."city" AS "city",
                "geo"."postcode" AS "postcode",
                "geo"."lat" AS "lat",
                "geo"."long" AS "long",
                "user"."id" AS "event_admin_id",
                "user"."username" AS "event_admin_username",
                "user"."avatar" AS "event_admin_avatar"
            FROM
                "geo"
            INNER JOIN "event" ON ("geo"."id" = "event"."geo_id")
            INNER JOIN "user" ON ("event"."event_admin" = "user"."id")
            WHERE
                "lat" <= $1::float + $2::float
                AND "long" <= $3::float + $2::float
                AND "lat" >= $1::float - $2::float
                AND "long" >= $3::float - $2::float`,
            values: [userProfile.geo.lat, (zoomFactor/10), userProfile.geo.long]
        }
        const result = await pool.query(query);
        if(result.rowCount === 0){
            return { message: `Il n'y a pas d'événement dans cette zone de recherche.`, zoomFactor: zoomFactor }
        }
        const resultToReturn = result.rows.map(event => {
            return {
                id: event.id,
                name: event.name,
                picture: event.picture,
                seats: event.seats,
                start_date: event.start_date,
                description: event.description,
                event_admin: {
                    id: event.event_admin_id,
                    username: event.event_admin_username,
                    avatar: event.event_admin_avatar
                },
                geo: {
                    id: event.geo_id,
                    city: event.city,
                    postcode: event.postcode,
                    lat: event.lat,
                    long: event.long
                }
            }
        });
        return resultToReturn;
    },
    async getEventById(id){
        const results = {
            "rows": {
                "event": {
                    // "id": 100,
                    "id": id,
                    "name": "Event 100",
                    "picture": 'http://www.spainisculture.com/export/sites/cultura/multimedia/galerias/fiestas/fiestas_sin_ficha/ajedrez2_javea_o_c.jpg_1306973099.jpg',
                    "seats": 10,
                    "description": "Je ne joue pas pour participer, je joue pour que vous sachiez que je suis le meilleur !",
                    "start_date": "2022-05-04T18:00:00.000Z",
                    "event_admin": {
                        "id": 10,
                        "username": "Chat10",
                        "avatar": "https://cdn.pixabay.com/photo/2016/06/14/00/14/cat-1455468_960_720.jpg"
                    },
                    "geo": {
                        "id": 17,
                        "city": "Lattes",
                        "postcode": 34970,
                        "lat": 43.567,
                        "long": 3.899
                    }
                }
            }
        }
        return results.rows;
    },
    async addEvent(event, userId){
        try {
            const infoCity = await toolsDataMapper.addCity(event.geo);
            const queryAddEvent = {
                text: `INSERT INTO event ("name", "picture", "seats", "description", "start_date", "event_admin", "geo_id") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING "id"`,
                values: [event.name, event.picture, event.seats, event.description, event.start_date, userId, infoCity.rows[0].id]
            }
            const result = await pool.query(queryAddEvent);
            if (result.rowCount !== 0) {
                return { successMessage: "Événement créé !", result: await eventDataMapper.getEventById(result.rows[0].id) };
            }
        } catch (error) {
            return {errorMessage: "Ajout de l'événement impossible."};
        }
    },
    async subscribeEventById(eventId, userId){
        try {
            const querySubscribeEvent = {
                text: `INSERT INTO "user_joins_event" ("event_id", "user_id") VALUES ($1, $2)`,
                values: [eventId, userId]
            }
            const result = await pool.query(querySubscribeEvent);
            if (result.rowCount !== 0) {
                return eventDataMapper.getEventById(eventId);
            }
        } catch (error) {
            if (error.code === '23505') {
                return {errorMessage: "Vous êtes déjà inscrit à cet événement."};
            }
            return {errorMessage: "Inscription à l'événement impossible."};
        }
    },
    async unsubscribeEventById(eventId, userId){
        try {
            const queryUnsubscribeEvent = {
                text: `DELETE FROM "user_joins_event" WHERE "event_id" = $1 AND "user_id" = $2`,
                values: [eventId, userId]
            }
            const result = await pool.query(queryUnsubscribeEvent);
            if (result.rowCount !== 0) {
                return { successMessage: "Vous êtes désinscrit de cet événement.", isUnsubscribed: true, eventId: eventId };
            }
            throw new Error({ errorMessage: "Vous n'êtes pas inscrit à cet événement.", isUnsubscribed: false, eventId: eventId } );
        } catch (error) {
            return { errorMessage: "Échec de la désinscription à l'événement.", isUnsubscribed: false };
        }
    }
}

module.exports = eventDataMapper;