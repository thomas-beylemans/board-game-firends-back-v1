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
        //test hash mot de passe
        // const hashedPassword = await bcrypt.hash(userData.password, 10);
        // const isCorrectPwd = await bcrypt.compare(req.body.password, user.password);

        // console.log(hashedPassword);
        const query = {
            text: `SELECT * FROM "user" WHERE "email" = $1 AND "password" = $2`,
            // values: [userData.email, hashedPassword]
            values: [userData.user.email, userData.user.password]
        };
        const result = await pool.query(query);
        return result.rowCount;
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