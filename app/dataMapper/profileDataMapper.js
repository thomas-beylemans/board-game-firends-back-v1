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
                "user"."id" = $1`,
            values: [userId]
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
                "user_joins_event"."user_id" = $1`,
            values: [userId]
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
                "user_owns_game"."user_id" = $1`,
            values: [userId]
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
            "game": resultGame.rows
        };
        return responseToReturn;
    },
    geoValuesValidation(geo) {
        const geoKeys = Object.keys(geo);
        const valuesMatchNull = [];
        
        geoKeys.forEach(key => {
            const result = geo[key] === null ? true : false;
            valuesMatchNull.push(result);
        });

        return valuesMatchNull.includes(true);
    },
    async updateProfile(userId, userData) {
        try {
            // Is user.geo exist AND contains changes?
            if (userData.hasOwnProperty('geo') && Object.keys(userData.geo).length !== 0) {
                // does includes null values;
                if (this.geoValuesValidation(userData.geo)) throw 'Données géo incorrectes';
                let result = await toolsDataMapper.addCity(userData.geo);
                const geo_id = result.rows[0].id;
                
                // update geo_id profile
                const query = {
                    text: `UPDATE "user"
                    SET "geo_id" = $1
                    WHERE id = $2
                    RETURNING *`,
                    values: [geo_id, userId]
                }
                await pool.query(query);
            }
            
            // Hashing Password
            userData.password ? userData.password = await bcrypt.hash(userData.password, 10) : null;

            // Keep only relevant keys (no object like geo)
            let userFields = Object.keys(userData).map((key) => {
                // if (typeof userData[key] !== 'object') { // null is an object
                if (key !== 'geo') return key
            });
            
            userFields = userFields.filter(element => element !== undefined);

            userFields = userFields.map((key, index) => {
                // if (typeof userData[key] !== 'object') { // null is an object
                if (key !== 'geo') return `"${key}" = $${index + 1}`
            });

            let userValues = Object.keys(userData).map((key, index) => {
                if (key !== 'geo') return userData[key]
            });

            userValues = userValues.filter(element => element !== undefined);

            if (userFields.length > 0) {
                const query = {
                    text: `UPDATE "user"
                    SET ${userFields}
                    WHERE id = $${userFields.length + 1}
                    RETURNING *`,
                    values: [...userValues, userId]
                }
                // console.log(query);
                const result = await pool.query(query);
                // console.log(result.rows[0]);
            }
            // Updates done, return user entity
            const userUpdated = await profileDataMapper.getOneUser(userId);
            return userUpdated;

        } catch (error) {
            throw error;
        }
    },

    async addGameToProfile(userId, gameReq) {

        // Add or Get BG
        let result = await toolsDataMapper.addGameToDatabase(gameReq)

        // Get BG id added or found
        const gameId = result.rows[0].id;
        // console.log(gameId);

        // Add => Ajout/INSERT INTO à la table de liaison user_owns_game
        const query = {
            text: `
                    INSERT INTO "user_owns_game" ("user_id" , "game_id")
                    VALUES ($1, $2)
                    RETURNING *`
            , values: [userId, gameId]
        }

        result = await pool.query(query);
        // console.log(`${result.command} relation user:game`);

        result = await this.getUserGamesList(userId);
        return { game: result.rows };
    },

    async getUserGamesList(userId) {
        const query = {
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
        const result = await pool.query(query);
        // console.log(result.rows);
        return result;
    },

    async deleteGameFromGamesList(userId, gameId) {
        try {
            const query = {
                text: `
                    DELETE
                    FROM "user_owns_game"
                    WHERE "game_id" = $1 AND "user_id" = $2`,
                values: [gameId, userId]
            }
            const result = await pool.query(query);
            if (result.rowCount === 0) throw new Error({ errorMessage: "Le jeu n'a pas été supprimé", isDeleted: false, gameId: gameId });

            return { successMessage: "Le jeu a été supprimé", isDeleted: true, gameId: gameId };
        } catch (error) {
            return { errorMessage: "Échec de la suppression du jeu.", isDeleted: false, gameId: gameId };
        }
    }
}

module.exports = profileDataMapper;