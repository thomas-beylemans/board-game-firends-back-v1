const pool = require('../database/dbClient');
const toolsDataMapper = require('./toolsDataMapper');
const bcrypt = require("bcrypt");

const userDataMapper = {
    async addOneUser(userToAdd) {
        const hashedPassword = await bcrypt.hash(userToAdd.password, 10);
        const infoCity = await toolsDataMapper.addCity(userToAdd.geo);
        const queryUser = {
            text: `INSERT INTO "user" (
                "email", "password", "username", "bio", "geo_id"
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING "id", "email", "username", "geo_id"`,
            values: [
                userToAdd.email,
                hashedPassword,
                userToAdd.username,
                userToAdd.bio,
                infoCity.rows[0].id
            ]
        };
        try {
            const results = await pool.query(queryUser);
            return results.rows[0];
        } catch (error) {
            if(error.code === '23505' && error.constraint === 'user_username_key') {
                throw `Le pseudo "${userToAdd.username}" est déjà utilisé !`
            } else if(error.code === '23505' && error.constraint === 'user_email_key') {
                throw `L'email "${userToAdd.email}" est déjà utilisé !`
            }
            throw error.detail;
        }
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
    }
}

module.exports = userDataMapper;