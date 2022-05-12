const { status } = require('express/lib/response');
const pool = require('../database/dbClient');
const toolsDataMapper = require('./toolsDataMapper')

const eventDataMapper = {
    async getEvents(){
        const results = {
            "rows": {
                "event": [
                    {
                        "id": 100,
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
                    },
                    {
                        "id": 27,
                        "name": "Event 27",
                        "picture": 'https://d2lv662meabn0u.cloudfront.net/boomerang/dynamic/editorial/00000000/421/1665670a7d1dc8574f071cb6aaeef85deb66c291_1589991670.webp',
                        "seats": 7,
                        "description": "Super soirée où ça sera fun mais on ne sait pas quoi faire pour l'instant...",
                        "start_date": "2022-05-25T19:00:00.000Z",
                        "event_admin": {
                            "id": 71,
                            "username": "Chat71",
                            "avatar": "https://cdn.pixabay.com/photo/2012/02/27/16/57/cat-17430_960_720.jpg"
                        },
                        "geo": {
                            "id": 21,
                            "city": "Villeneuve-lès-Maguelone",
                            "postcode": 34750,
                            "lat": 43.5119,
                            "long": 3.8589
                        }
                    },
                    {
                        "id": 589,
                        "name": "Event trop trop cool",
                        "picture": 'https://cache.magazine-avantages.fr/data/photo/w1000_ci/1jv/cartes-a-jouer-diy-do-it-yourself.jpg',
                        "seats": 31,
                        "description": "Une aprèm entière à faire des solitaires entre amis, ça te dit ?!",
                        "start_date": "2022-05-27T12:00:00.000Z",
                        "event_admin": {
                            "id": 4,
                            "username": "GriffeurDu34",
                            "avatar": "https://cdn.pixabay.com/photo/2015/01/04/10/46/lion-588144_960_720.jpg"
                        },
                        "geo": {
                            "id": 3971,
                            "city": "Palavas-les-Flots",
                            "postcode": 34250,
                            "lat": 43.5323,
                            "long": 3.9346
                        }
                    }
                ]
            }
        }
        return results.rows;
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
            const infoCity = await toolsDataMapper.addCity(event.geo, event.geo);
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
            console.log(result);
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