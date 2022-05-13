const pool = require('../database/dbClient');

const toolsDataMapper = {
    async getCities(city, postcode) {
        const query = {
            text: `
                SELECT *
                FROM "geo"
                WHERE "city" = $1 AND "postcode" = $2
            `
            , values: [city, postcode]
        };
        const result = await pool.query(query);
        // console.log(result.rows[0]);
        return (result);
    },
    async addCity(geo) {
        // check if city exists in database
        let result = await this.getCities(geo.city, geo.postcode);
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
        // console.log(valuesRef);
        try {
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
            // console.log(result.rows[0]);
            return result || null
        } catch (error) {
            console.log(error);
        }
    },

    async findGameById(gameId) {
        const query = {
            text: `
            SELECT *
            FROM "game"
            WHERE "id" = $1
            `
            , values: [gameId]
        };
        const result = await pool.query(query);
        return result
    },

    async findGameByName(gameName) {
        const query = {
            text: `
            SELECT *
            FROM "game"
            WHERE "name" = $1
            `
            , values: [gameName]
        };
        const result = await pool.query(query);
        return result
    },

    async updateGame(gameDb, gameReq) {
        // update only concerns image at the moment

        console.log(gameDb.picture);
        console.log(gameReq.picture);

        // only update picture if it's not already set
        if (gameDb.picture === null && gameReq.picture !== undefined && gameReq.picture !== null) {
            // update image in DB => query SQL 
            // console.log("Updating picture");
            const query = {
                text: `UPDATE "game"
                    SET picture = $1
                    WHERE id = $2
                    RETURNING *`,
                values: [gameReq.picture, gameDb.id]
            };
            const result = await pool.query(query);
            return result
        }

        // Tests:
        // - if gameDb exists w/ picture && gameReq w/ picture => no update picture => OK
        // - if gameDb exists w/ picture && gameReq w/o picture => no update picture  => OK
        // - if gameDb exists w/o picture && gameReq w/ picture => update picture => OK
        // - if gameDb exists w/o picture && gameReq w/o picture => no update picture  => OK

        return await this.findGameById(gameDb.id);
    },

    async addGameToDatabase(game) {
        let result = await this.findGameByName(game.name);

        // if found, try update
        if (result.rowCount !== 0) {
            result = await this.updateGame(result.rows[0], game);
            return result;
        }

        // if not found => add to db
        let gameFields = Object.keys(game).map((key) => {
            return `"${key}"`
        });
        // console.log(gameFields);

        let gameValues = Object.values(game);
        // console.log(gameValues);


        let valuesRef = Object.keys(game).map((_, index) => {
            return `$${index + 1}`
        });

        const query = {
            text: `
                INSERT INTO "game" (${gameFields})
                VALUES (${valuesRef.join()})
                RETURNING id
            `
            , values: [...gameValues]
        };
        result = await pool.query(query);

        console.log(result.rows[0]);
        console.log(`${result.command} game`);
        return result;
    }
}


module.exports = toolsDataMapper;