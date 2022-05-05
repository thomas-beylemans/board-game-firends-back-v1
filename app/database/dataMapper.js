const pool = require('./dbClient');
const bcrypt = require("bcrypt"); // module pour crypter les mdp


const dataMapper = {
    /**
     * Récupère toutes les user rangées par défaut par name
     * @returns {Promise<Array>} La liste des promos
     */
     async getOneUser(userId) {
        const query = {
            text: `SELECT * FROM "user" WHERE id = $1`,
            values: [userId]
        };

        const result = await pool.query(query);
        return result.rows[0] || null;
    },
    async checkUserRegistration(userData) {
        
        // check pwd
        let query = {
            text: `SELECT * FROM "user" WHERE "email" = $1`,
            values: [userData.email]
        };
        const userReference = await pool.query(query);
        const passwordReference = userReference.rows[0].password;

        const isCorrectPwd = await bcrypt.compare(userData.password, passwordReference);
        if (!isCorrectPwd) {
            userReference.rows[0].isAuthorized = false;
        } else {
            userReference.rows[0].isAuthorized = true;
        }
        
        // delete password from userReference result
        delete userReference.rows[0].password;

        return userReference.rows[0];
    },

            // // CASE all valid
            // if (errors.length === 0) {
            //     const userData = req.body;
            //     userData.password = await bcrypt.hash(req.body.password, 10);
            //     await User.create(userData);
            //     return res.redirect('/');
            // }

    async addOneUser(userToAdd) {
        console.log(userToAdd)
        const hashedPassword = await bcrypt.hash(userToAdd.user.password, 10);
        const query = {
            text: `INSERT INTO "user" (
                "email", "password", "username", "bio", "geo_id"
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING "id", "email", "username", "bio", "geo_id"`,
            values: [
                userToAdd.user.email,
                hashedPassword,
                userToAdd.user.username,
                userToAdd.user.bio,
                1
            ]
        };
        const results = await pool.query(query);
        return results.rows[0];
    }
}


module.exports = dataMapper;