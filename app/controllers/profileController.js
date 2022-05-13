const profileDataMapper = require('../dataMapper/profileDataMapper');

const profileController = {
    async getProfileById(req, res, next) {
        try {
            // TODO: check if the userId is a number respecting the format (with JOI)
            const userId = Number(req.params.profileId);
            const result = await profileDataMapper.getOneUser(userId);
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
        const result = await profileDataMapper.getDashboard(userId);
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
            const result = await profileDataMapper.updateProfile(userId, req.body.user);
            res.status(200).json({ user: result, accessToken: req.bearerToken });
        } catch (error) {
            res.status(403).json({ errorMessage: error });
        }
    },
    async addGame(req, res, next){
        try {
             // check if req.body has game's data
             if (!req.body.user.hasOwnProperty('game') || Object.keys(req.body.user.game).length === 0) {
                console.log('toto');
                throw `Données jeu absents`;
            }
            const userId = Number(req.userToken.user.id);
            const result = await profileDataMapper.addGameToProfile(userId, req.body.user.game);
            res.status(200).json({ user: result, accessToken: req.bearerToken });
        } catch (error) {
            res.status(403).json({ errorMessage: error });
        }
    },
    async deleteGame(req, res, next){
        try {
            // is request valid?
            const gameId = req.body.user.game.id;
            if (!gameId) throw "game data is missing";

            // user owns game?
            const userId = Number(req.userToken.user.id);
            let gameList = await profileDataMapper.getUserGamesList(userId);
            // console.log(gameList.rows);
            
            const userGameIdList = gameList.rows.map(game => game.id);
            // console.log(userGameIdList);

            // if not found
            if (!userGameIdList.includes(gameId)) throw "Game not found in your list"
            
            let gameToDelete = gameList.rows.find(game => game.id === gameId);
            // console.log(gameToDelete);
            
            // if found, delete processing…
            result = await profileDataMapper.deleteGameFromGamesList(userId, gameId);

            // request the new user game list
            gameList = await profileDataMapper.getUserGamesList(userId);

            res.status(200).json({
                "isDeleted": true,
                "gameDeleted": gameToDelete,
                "user": {
                    game: gameList.rows,
                },
                accessToken: req.bearerToken
            });
        } catch (error) {
            res.status(403).json({ "isDeleted": false, errorMessage: error , accessToken: req.bearerToken});
        }
    }
}

module.exports = profileController;