const eventDataMapper = require('../dataMapper/eventDataMapper');
const profileDataMapper = require('../dataMapper/profileDataMapper');

const eventController = {
    async getEvents(req, res, next){
        const zoomFactor = req.body['zoomFactor'] ? req.body['zoomFactor'] : 1;
        try {
            const userProfile = await profileDataMapper.getOneUser(req.userToken.user.id);
            const result = await eventDataMapper.getEvents(userProfile, zoomFactor);
            let responseToReturn = { accessToken: req.bearerToken, zoomFactor, events: result };
            if (result.length === 0) {
                responseToReturn.isEventFound = false;
                responseToReturn.message = `Il n'y a pas d'événement dans cette zone de recherche`;
            } else {
                responseToReturn.isEventFound = true;
            }
            res.status(200).json(responseToReturn);
        }
        catch (error) {
            console.log(error);
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
    },
    async addEvent(req, res, next){
        try {
            const userToken = req.userToken;
            const { event } = req.body;
            const result = await eventDataMapper.addEvent(event, userToken.user.id);
            res.status(201).json({ events: result, accessToken: req.bearerToken });
        }
        catch (error) {
            res.status(403).json({ errorMessage: error });
        }
    },
    async subscribeEventById(req, res, next){
        try {
            let eventIdParams, eventIdBody;
            try {
                eventIdParams = Number(req.params.id);
                eventIdBody = Number(req.body.event.id);
                // we check if the eventId in the params is the same than the one in the body
                if (eventIdParams !== eventIdBody) {
                    throw Error;
                }
            } catch (error) {
                return res.status(400).json({ errorMessage: 'Les deux identifiants ne correspondent pas.', accessToken: req.bearerToken });
            }
            const userToken = req.userToken;
            const result = await eventDataMapper.subscribeEventById(eventIdBody, userToken.user.id);
            res.status(201).json({ events: result, accessToken: req.bearerToken });
        }
        catch (error) {
            res.status(403).json({ errorMessage: error, accessToken: req.bearerToken });
        }
    },
    async unsubscribeEventById(req, res, next){
        try {
            let eventIdParams, eventIdBody;
            try {
                eventIdParams = Number(req.params.id);
                eventIdBody = Number(req.body.event.id);
                // we check if the eventId in the params is the same than the one in the body
                if (eventIdParams !== eventIdBody) {
                    throw Error;
                }
            }
            catch (error) {
                return res.status(400).json({ errorMessage: 'Les deux identifiants ne correspondent pas.', accessToken: req.bearerToken });
            }
            const userToken = req.userToken;
            const result = await eventDataMapper.unsubscribeEventById(eventIdBody, userToken.user.id);
            res.status(200).json({ events: result, accessToken: req.bearerToken });
        }
        catch (error) {
            res.status(403).json({ errorMessage: error, accessToken: req.bearerToken });
        }
    }
}

module.exports = eventController;