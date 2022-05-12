const eventDataMapper = require('../dataMapper/eventDataMapper');

const eventController = {
    async getEvents(req, res, next){
        try {
            const result = await eventDataMapper.getEvents();
            res.status(200).json({ events: result, accessToken: req.bearerToken });
        }
        catch (error) {
            res.status(404).json({ errorMessage: error });
        }
    },
    async getEventById(req, res, next){
        try {
            const eventId = Number(req.params.id);
            const result = await eventDataMapper.getEventById(eventId);
            res.status(200).json({ events: result, accessToken: req.bearerToken });
        }
        catch (error) {
            res.status(404).json({ errorMessage: error });
        }
    }
}

module.exports = eventController;