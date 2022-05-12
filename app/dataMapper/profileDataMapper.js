const pool = require('../database/dbClient');
const toolsDataMapper = require('./toolsDataMapper');
const userDataMapper = require('./userDataMapper');
const bcrypt = require("bcrypt");


const profileDataMapper = {
    async getOneUser(userId) {
        const queryUser = {
            text: `SELECT 
                "user"."id" AS "user_id",
                "user"."email",
                "user"."username",
                "user"."avatar",
                "user"."bio",
                "geo"."id" AS "geo_id",
                "geo"."city",
                "geo"."postcode",
                "geo"."lat",
                "geo"."long"
            FROM
                "user"
            INNER JOIN "geo" ON ("geo"."id" = "geo_id")
            WHERE
                "user"."id" = $1`,
            values: [userId]
        };
        const queryGame = {
            text: `SELECT
                "game"."id" AS "id",
                "game"."name" AS "name",
                "game"."picture" AS "picture"
            FROM
                "user_owns_game"
            INNER JOIN "game" ON ("game"."id" = "user_owns_game"."game_id")
            WHERE
                "user_owns_game"."user_id" = $1`,
            values: [userId]
        };
        const resultUser = await pool.query(queryUser);
        if (resultUser.rowCount == 0) {
            return {
                // TODO: use the error handler
                rowCount: 0,
                errorMessage: "User not found"
            };
        }
        const resultGame = await pool.query(queryGame);

        const responseToReturn = {
            "id": resultUser.rows[0].user_id,
            "email": resultUser.rows[0].email,
            "username": resultUser.rows[0].username,
            "avatar": resultUser.rows[0].avatar,
            "bio": resultUser.rows[0].bio,
            "geo": {
                "id": resultUser.rows[0].geo_id,
                "city": resultUser.rows[0].city,
                "postcode": resultUser.rows[0].postcode,
                "lat": resultUser.rows[0].lat,
                "long": resultUser.rows[0].long
            },
            "game": resultGame.rows
        };

        return responseToReturn;
    },
    async getDashboard(userId) {
        const queryUser = {
            text: `SELECT 
                "user"."id" AS "user_id",
                "user"."email",
                "user"."username",
                "user"."avatar",
                "user"."bio",
                "geo"."id" AS "geo_id",
                "geo"."city",
                "geo"."postcode",
                "geo"."lat",
                "geo"."long"
            FROM
                "user"
            INNER JOIN "geo" ON ("geo"."id" = "geo_id")
            WHERE
                "user"."id" = 1`
            // values: [userId]
        };
        const queryEvent = {
            text: `SELECT
                "event"."id" AS "id",
                "event"."name" AS "name",
                "event"."picture" AS "picture",
                "event"."seats" AS "seats",
                "event"."description" AS "description",
                "event"."start_date" AS "start_date",
                "geo"."id" AS "geo_id",
                "geo"."city",
                "geo"."postcode",
                "geo"."lat",
                "geo"."long",
                "user"."id" AS "event_admin_id",
                "user"."username" AS "event_admin_username",
                "user"."avatar" AS "event_admin_avatar"

            FROM
                "user_joins_event"
            INNER JOIN "event" ON ("event"."id" = "user_joins_event"."event_id")
            INNER JOIN "geo" ON ("event"."geo_id" = "geo"."id")
            INNER JOIN "user" ON ("event"."event_admin" = "user"."id")
            WHERE
                "user_joins_event"."user_id" = 1`
            // values: [userId]
        };
        const queryGame = {
            text: `SELECT
                "game"."id" AS "id",
                "game"."name" AS "name",
                "game"."picture" AS "picture",
                "user_owns_game"."created_at" AS "date_of_add"
            FROM
                "user_owns_game"
            INNER JOIN "game" ON ("game"."id" = "user_owns_game"."game_id")
            WHERE
                "user_owns_game"."user_id" = 1`
            // values: [userId]
        };
        const resultUser = await pool.query(queryUser);
        const resultEvent = await pool.query(queryEvent);
        const resultGame = await pool.query(queryGame);

        if (resultUser.rowCount == 0) {
            return {
                errorMessage: `L'utilisateur n'a pas été trouvé...`
            };
        }
        const events = resultEvent.rows.map(event => {
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
        const games = resultGame.rows.map(game => game);


        const responseToReturn = {
            "id": resultUser.rows[0].user_id,
            "email": resultUser.rows[0].email,
            "username": resultUser.rows[0].username,
            "avatar": resultUser.rows[0].avatar,
            "bio": resultUser.rows[0].bio,
            "geo": {
                "id": resultUser.rows[0].geo_id,
                "city": resultUser.rows[0].city,
                "postcode": resultUser.rows[0].postcode,
                "lat": resultUser.rows[0].lat,
                "long": resultUser.rows[0].long
            },
            "event": events,
            "game": games
        };
        return responseToReturn;
    },

    async updateProfile(userId, userData) {
        // does geo key is exist in userData AND contains changes?
        if (userData.hasOwnProperty('geo') && Object.keys(userData.geo).length !== 0) {
            let result = await toolsDataMapper.addCity(userData.geo);

            const geo_id = result.rows[0].id || null;

            // update geo_id profile
            const query = {
                text: `UPDATE "user"
                    SET "geo_id" = $1
                    WHERE id = $2
                    RETURNING *`,
                values: [geo_id, userId]
            }

            result = await pool.query(query);
            // console.log(result.rows[0]);
        }

        // User data processing
        userData.password ? userData.password = await bcrypt.hash(userData.password, 10) : null;

        let userFields = Object.keys(userData).map((key, index) => {
            // console.log(typeof userData[key]);
            if (typeof userData[key] !== 'object') {
                return `"${key}" = $${index + 1}`
            }
        });

        userFields = userFields.filter(element => element !== undefined);

        let userValues = Object.values(userData).map((value) => {
            // console.log(typeof value);
            if (typeof value !== 'object') {
                return value;
            }
        });

        userValues = userValues.filter(element => element !== undefined);

        // console.log(userFields);
        // console.log(userValues);

        if (userFields.length > 0) {
            const query = {
                text: `UPDATE "user"
                    SET ${userFields}
                    WHERE id = $${userFields.length + 1}
                    RETURNING *`,
                values: [...userValues, userId]
            }
            const result = await pool.query(query);
            // console.log(result.rows[0]);
        }
        // Updates done, return user entity
        const userUpdated = await profileDataMapper.getOneUser(userId);
        return userUpdated;
    },

    async addGameToProfile(userId, gameData){
        
        // ajout ou récupération du BG
        result = await toolsDataMapper.addGameToDatabase(gameData)
        
        // récupération du BG id
        const gameId = result.rows[0].id;
        console.log(gameId);
        
        // Check si pas déjà sur mon profil dans user_owns_game
            // text : SELECT game_id
            // FROM user_owns_game
            // WHERE user_id = userId
            // values : [gameId, userId]

        // Si result.rowCount !== O {guard clause : return}

        // Else => Ajout/INSERT INTO à la table de liaison user_owns_game

            // const query = {
            //     text: `UPDATE "user_owns_game"
            //         SET "geo_id" = $1
            //         WHERE id = $2
            //         RETURNING *`,
            //     values: [geo_id, userId]
            // }

            result = await pool.query(query);
            console.log(result.rows[0]);
            
            let gameUpdated = await toolsDataMapper.findGameById(gameId);
            console.log(gameUpdated.rows[0]);
            return gameUpdated;
        }



}

module.exports = profileDataMapper;