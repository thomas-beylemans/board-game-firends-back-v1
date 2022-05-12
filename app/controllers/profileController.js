const dataMapper = require('../database/dataMapper');

const profileController = {
    async getProfileById(req, res, next) {
        try {
            // TODO: check if the userId is a number respecting the format (with JOI)
            const userId = Number(req.params.profileId);
            const result = await dataMapper.getOneUser(userId);
            if (result.rowCount == 0) {
                throw `L'utilisateur n'existe pas !`;
            }
            res.status(200).json({ user: result, accessToken: req.bearerToken });
        } catch (error) {
            res.status(404).json({ errorMessage: error });
        }
    },
    async getDashboard(req, res, next) {
        // catch the id of the user inside the token
        const userId = Number(req.userToken.user.id);
        const result = await dataMapper.getDashboard(userId);
        res.status(200).json({ user: result, accessToken: req.bearerToken });
    },
    async updateProfile(req, res, next) {
        try {
            // check if req.body has user's data
            if (!req.body.hasOwnProperty('user') || Object.keys(req.body.user).length === 0) {
                throw `Données utilisateurs absents`;
            }
            // catch the id of the user inside the token
            const userId = Number(req.userToken.user.id);
            const result = await dataMapper.updateProfile(userId, req.body.user);
            res.status(200).json({ user: result, accessToken: req.bearerToken });
        } catch (error) {
            res.status(403).json({ errorMessage: error });
        }
    }
}

module.exports = profileController;