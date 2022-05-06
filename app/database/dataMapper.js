const pool = require('./dbClient');
const bcrypt = require("bcrypt"); // module pour crypter les mdp


const dataMapper = {
    async getOneUser(userId) {
        const query = {
            text: `SELECT * FROM "user" WHERE id = $1`,
            values: [userId]
        };
        const result = await pool.query(query);
        
        if (result.rowCount == 0) {
            return {
                // TODO: use the error handler
                rowCount: 0,
                message: "User not found"
            };
        }
        return result.rows[0];
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
                message: "Email not found"
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
    }
}


module.exports = dataMapper;