const pool = require('./dbClient');
const bcrypt = require("bcrypt"); // module pour crypter les mdp


const dataMapper = {
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
    async checkUserRegistration(userData) {
        // trying to find the user in the database with his email
        const query = {
            text: `SELECT * FROM "user" WHERE "email" = $1`,
            values: [userData.email]
        };
        const userFound = await pool.query(query);

        // if user doesn't exists, return without authorization
        if (userFound.rowCount == 0) {
            return {
                // TODO: use the error handler
                isAuthorized: false,
                errorMessage: "Email not found"
            };
        }

        const passwordReference = userFound.rows[0].password;
        userFound.rows[0].isAuthorized = await bcrypt.compare(userData.password, passwordReference);

        // delete password from userFound result
        delete userFound.rows[0].password;

        return userFound.rows[0];
    },
    async addOneUser(userToAdd) {
        const hashedPassword = await bcrypt.hash(userToAdd.password, 10);
        const query = {
            text: `INSERT INTO "user" (
                "email", "password", "username", "bio", "geo_id"
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING "id", "email", "username", "bio", "geo_id"`,
            values: [
                userToAdd.email,
                hashedPassword,
                userToAdd.username,
                userToAdd.bio,
                1
            ]
        };
        const results = await pool.query(query);
        return results.rows[0];
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
                "event"."seats" AS "seats",
                "event"."description" AS "description",
                "event"."start_date" AS "start_date",
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
                seats: event.seats,
                start_date: event.start_date,
                description: event.description,
                event_admin: {
                    id: event.event_admin_id,
                    username: event.event_admin_username,
                    avatar: event.event_admin_avatar
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
        console.log(responseToReturn);
        return responseToReturn;
    },

    async getCities(city) {
        const query = {
            text: `
                SELECT *
                FROM "geo"
                WHERE "city" = $1
            `
            , values: [city]
        };
        const result = await pool.query(query);
        // console.log(result.rows[0]);
        return (result);
    },

    async addCity(geo) {
        // check if city exists in database
        let result = await this.getCities(geo.city);

        // if city found…
        if (result.rowCount !== 0) {
            // console.log(`"${result.rows[0].city}" (id:${result.rows[0].id}), déjà présent en BDD geo`);
            return result;
        }

        // city not found… Geo data processing
        
        // console.log('Ajout de l\'entité à la BDD geo');
        let geoFields = Object.keys(geo).map((key) => {
            return `"${key}"`
        });

        let geoValues = Object.values(geo);

        // console.log(geoFields);
        // console.log(geoValues);

        let valuesRef = Object.keys(geo).map((_, index) => {
            return `$${index + 1}`
        });

        const query = {
            text: `
                INSERT INTO "geo" ( ${geoFields} )
                VALUES ( ${valuesRef.join()} )
                RETURNING id
                `,
            values: [...geoValues]
        }
        // console.log(query);

        result = await pool.query(query);
        // console.log(result.rows[0] || null);
        return result || null
    },

    async updateProfile(userId, userData) {

        // does geo is key in userData?
        if (userData.hasOwnProperty('geo')) {
            let result = await this.addCity(userData.geo);
            const geo_id = result.rows[0].id || null;
            // console.log();

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
        return this.getOneUser(userId);
    },
}


module.exports = dataMapper;