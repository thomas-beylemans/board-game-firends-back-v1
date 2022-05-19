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
        const queryEvent = {
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
        const resultEvent = await pool.query(queryEvent);
        if(resultEvent.rowCount === 0){
            throw `Aucun événement ne correspond à la recherche !`;
        }
        const queryUserJoins = {
            text: `SELECT
                "user"."id" AS "id",
                "user"."username" AS "username",
                "user"."avatar" AS "avatar"
            FROM
                "event"
            INNER JOIN "user_joins_event" ON ("user_joins_event"."event_id" = "event"."id")
            INNER JOIN "user" ON ("user_joins_event"."user_id" = "user"."id")
            WHERE
                "event"."id" = $1`,
            values: [id]
        };
        const resultUserJoins = await pool.query(queryUserJoins);

        const resultToReturn = {
            id: resultEvent.rows[0].id,
            name: resultEvent.rows[0].name,
            picture: resultEvent.rows[0].picture,
            seats: resultEvent.rows[0].seats,
            start_date: resultEvent.rows[0].start_date,
            description: resultEvent.rows[0].description,
            event_admin: {
                id: resultEvent.rows[0].event_admin_id,
                username: resultEvent.rows[0].event_admin_username,
                avatar: resultEvent.rows[0].event_admin_avatar
            },
            geo: {
                id: resultEvent.rows[0].geo_id,
                city: resultEvent.rows[0].city,
                postcode: resultEvent.rows[0].postcode,
                lat: resultEvent.rows[0].lat,
                long: resultEvent.rows[0].long
            },
            event_player: resultUserJoins.rows
        }
        return resultToReturn;
    },
    async addEvent(event, userId){
        try {
            const infoCity = await toolsDataMapper.addCity(event.geo);
            // console.log(infoCity);
            const queryAddEvent = {
                text: `INSERT INTO event ("name", "picture", "seats", "description", "start_date", "event_admin", "geo_id") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING "id"`,
                values: [event.name, event.picture, event.seats, event.description, event.start_date, userId, infoCity.rows[0].id]
            }
            const result = await pool.query(queryAddEvent);
            console.log(result.rows[0]);
            if (result.rowCount !== 0) {
                return { 
                    eventCreated: true,
                    successMessage: "Événement créé !",
                    result: await eventDataMapper.getEventById(result.rows[0].id) };
            }
        } catch (error) {
            return {
                eventCreated: true,
                errorMessage: "Ajout de l'événement impossible.",
                errorDetails: error
            };
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
                return { successMessage: "Vous êtes désinscrit de cet événement." };
            }
            throw new Error({ errorMessage: "Vous n'êtes pas inscrit à cet événement." } );
        } catch (error) {
            return { errorMessage: "Échec de la désinscription à l'événement." };
        }
    }
}

module.exports = eventDataMapper;