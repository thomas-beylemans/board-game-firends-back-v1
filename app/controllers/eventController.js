const eventDataMapper = require('../dataMapper/eventDataMapper');
const profileDataMapper = require('../dataMapper/profileDataMapper');

const eventController = {
    async getEvents(req, res, next){
        const zoomFactor = req.query['zoomFactor'] ? req.query['zoomFactor'] : 1;
        const limit = req.query['limit'] ? req.query['limit'] : 100;
        try {
            const userProfile = await profileDataMapper.getOneUser(req.userToken.user.id);
            const result = await eventDataMapper.getEvents(userProfile, zoomFactor, limit);
            let responseToReturn = { accessToken: req.bearerToken, zoomFactor };
            if (result.length === 0) {
                responseToReturn.isEventFound = false;
                responseToReturn.message = `Il n'y a pas d'événement dans cette zone de recherche.`;
            } else {
                responseToReturn.isEventFound = true;
            }
            responseToReturn.event = result;
            res.status(200).json(responseToReturn);
        }
        catch (error) {
            console.log(error);
            res.status(404).json({
                errorMessage: error,
                accessToken: req.bearerToken
            });
        }
    },
    async getEventById(req, res, next){
        try {
            const eventId = Number(req.params.id);
            const result = await eventDataMapper.getEventById(eventId);
            res.status(200).json({
                event: result,
                accessToken: req.bearerToken
            });
        }
        catch (error) {
            res.status(404).json({
                errorMessage: error,
                accessToken: req.bearerToken
            });
        }
    },
    async addEvent(req, res, next){
        try {
            const userToken = req.userToken;
            const { event } = req.body;
            const result = await eventDataMapper.addEvent(event, userToken.user.id);
            res.status(201).json({
                event: result,
                accessToken: req.bearerToken
            });
        }
        catch (error) {
            res.status(403).json({
                errorMessage: error,
                accessToken: req.bearerToken
            });
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
            res.status(201).json({
                event: result,
                isSubscribed: true,
                successMessage: 'Vous êtes inscrit à cet événement !',
                accessToken: req.bearerToken
            });
        }
        catch (error) {
            res.status(403).json({
                isSubscribed: false,
                errorMessage: error,
                accessToken: req.bearerToken
            });
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
                return res.status(400).json({
                    errorMessage: 'Les deux identifiants ne correspondent pas.',
                    accessToken: req.bearerToken });
            }
            const userToken = req.userToken;
            const result = await eventDataMapper.unsubscribeEventById(eventIdBody, userToken.user.id);
            res.status(200).json({
                event: result,
                isUnsubscribed: true,
                successMessage: 'Vous êtes désinscrit de cet événement.',
                accessToken: req.bearerToken
            });
        }
        catch (error) {
            res.status(403).json({
                errorMessage: error,
                isUnsubscribed: false,
                accessToken: req.bearerToken
            });
        }
    }
}

module.exports = eventController;