const pool = require('./dbClient');
const bcrypt = require("bcrypt"); // module pour crypter les mdp
const res = require('express/lib/response');


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

    async updateProfile(userId, userData){
        userData.user.password = await bcrypt.hash(userData.user.password, 10);
        let fields = Object.keys(userData.user).map((key, index) => {
            // console.log(typeof userData.user[key]);
            if ( typeof userData.user[key] !== 'object') {
                return `"${key}" = $${index + 1}`
            }
        });
        
        fields = fields.filter(element => {
            return element !== undefined;
        });

        

        let values = Object.values(userData.user).map((value, index) => {
            // console.log(typeof value);
            if ( typeof value !== 'object') {
                return value;
            }
        });
        values = values.filter(element => {
            return element !== undefined;
        });

        console.log(fields);
        // console.log(fields.length + 1);
        console.log(values);
        
        const query = {
            text:`UPDATE "user"
                SET ${fields}
                WHERE id = $${fields.length + 1}
                RETURNING *`,
            values: [...values, userId]
        }
        
        const results = await pool.query(query);
        console.log(results.rows[0]);
        
    },
    async getEvents(){
        const results = {
            "rows": {
                "event": [
                    {
                        "id": 100,
                        "name": "Event 100",
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
    }
}


module.exports = dataMapper;