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

    async findGameById(gameId){
        const query = {
            text: `
            SELECT *
            FROM "game"
            WHERE "id" = $1
            `
            , values: [gameId]
        };
        const result = await pool.query(query);
        return (result || null );
    },

    async findGameByName(gameName){
        const query = {
            text: `
            SELECT *
            FROM "game"
            WHERE "name" = $1
            `
            , values: [gameName]
        };
        const result = await pool.query(query);
        return (result || null );
    },

    async addGameToDatabase(game){
        let result = await this.findGameByName(game.name);

        // if found
        if (result.rowCount !== 0) {
            //v1.1 update la picture si celle ci est null et que dans {game} elle est renseignée
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

        // console.log(`game added`);
        return result || null;
    }
}


module.exports = toolsDataMapper;