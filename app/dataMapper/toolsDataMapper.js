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
    }
}


module.exports = toolsDataMapper;