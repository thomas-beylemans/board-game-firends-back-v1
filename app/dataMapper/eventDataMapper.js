const pool = require('../database/dbClient');
const toolsDataMapper = require('./toolsDataMapper')

const eventDataMapper = {
    async getEvents(userProfile, zoomFactor, limit) {
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
                AND "long" >= $3::float - $2::float
            LIMIT $4::int`,
            values: [userProfile.geo.lat, (zoomFactor/10), userProfile.geo.long, limit]
        }
        const result = await pool.query(query);
        if(result.rowCount === 0){
            return [];
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
                "event"
            INNER JOIN "geo" ON ("event"."geo_id" = "geo"."id")
            INNER JOIN "user" ON ("event"."event_admin" = "user"."id")
            WHERE
                "event"."id" = $1`,
            values: [id]
        };
        const result = await pool.query(query);
        if(result.rowCount === 0){
            throw `Aucun événement ne correspond à la recherche !`;
        }
        const resultToReturn = {
            id: result.rows[0].id,
            name: result.rows[0].name,
            picture: result.rows[0].picture,
            seats: result.rows[0].seats,
            start_date: result.rows[0].start_date,
            description: result.rows[0].description,
            event_admin: {
                id: result.rows[0].event_admin_id,
                username: result.rows[0].event_admin_username,
                avatar: result.rows[0].event_admin_avatar
            },
            geo: {
                id: result.rows[0].geo_id,
                city: result.rows[0].city,
                postcode: result.rows[0].postcode,
                lat: result.rows[0].lat,
                long: result.rows[0].long
            }
        }
        return resultToReturn;
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