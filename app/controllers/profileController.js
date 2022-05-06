const dataMapper = require('../database/dataMapper');

const profileController = {
    async getProfileById(req, res, next){
        try {
            // TODO: check if the userId is a number respecting the format (with JOI)
            const userId = Number(req.params.profileId);
            const result = await dataMapper.getOneUser(userId);
            if (result.rowCount == 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = profileController;