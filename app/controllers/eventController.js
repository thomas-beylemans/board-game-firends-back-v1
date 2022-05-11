const dataMapper = require('../database/dataMapper');

const eventController = {
    async getEvents(req, res, next){
        try {
            const result = await dataMapper.getEvents();
            res.status(200).json({ events: result, accessToken: req.bearerToken });
        }
        catch (error) {
            res.status(404).json({ errorMessage: error });
        }
    }
}

module.exports = eventController;