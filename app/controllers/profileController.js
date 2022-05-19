const profileDataMapper = require('../dataMapper/profileDataMapper');
const cloudinaryPersonalMethods = require('../middlewares/cloudinary');

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
            // catch the id of the user inside the token
            const userId = Number(req.userToken.user.id);
            
            // check if there is a file in the request, if yes, upload it and create the avatar field on the req.body.user
            if (req.globalFileName) {
                const userData = await profileDataMapper.getOneUser(userId);
                
                let public_id = '';
                if (userData.avatar !== null) {
                    // scrap public_id from secure_url value
                    const regex = /images\/.+(?=\.)/gim
                    // secure_url example : "https://res.cloudinary.com/board-game-friends/image/upload/v1652883691/images/d04d1520-d6b5-11ec-b34a-c9bb2a0fec80.png";
                    public_id = userData.avatar.match(regex)[0];
                }
                
                // upload new image on Cloudinary
                let result = await cloudinaryPersonalMethods.uploadPicture(req.globalFileName);
                
                // delete Cloudinary image if exist in the database
                if (userData.avatar !== null || result !== null) {
                    await cloudinaryPersonalMethods.deletePicture(public_id);
                }

                req.body = { user: { avatar: result.secure_url } };
            }
            // check if req.body has user's data
            if (!req.body.hasOwnProperty('user') || Object.keys(req.body.user).length === 0) {
                throw `Données utilisateurs absentes`;
            }
            const result = await profileDataMapper.updateProfile(userId, req.body.user);
            res.status(200).json({
                isUpdated : true,
                user: result,
                accessToken: req.bearerToken
            });
        } catch (error) {
            res.status(403).json(
            {
                errorMessage: error,
                isUpdated: false,
                accessToken: req.bearerToken
            });

        }
    },
    async addGame(req, res, next){
        try {
             // check if req.body has game's data
             if (!req.body.user.hasOwnProperty('game') || Object.keys(req.body.user.game).length === 0) {
                throw `Données jeu absents`;
            }
            const userId = Number(req.userToken.user.id);
            const result = await profileDataMapper.addGameToProfile(userId, req.body.user.game);
            res.status(200).json({ user: result, isAdded: true, accessToken: req.bearerToken });
        } catch (error) {
            res.status(403).json({ isAdded: false, errorMessage: error });
        }
    },
    async deleteGame(req, res, next){
        try {
            // is request valid?
            const gameId = req.body.game.id;
            if (!gameId) throw "game data is missing";

            // user owns game?
            const userId = Number(req.userToken.user.id);
            let gameList = await profileDataMapper.getUserGamesList(userId);
            
            // if not found
            if (!gameList.rows.filter(game => game.id === gameId)) throw "Game not found in your list"
            
            // if found, delete processing…
            const result = await profileDataMapper.deleteGameFromGamesList(userId, gameId);
            // request the new user game list
            gameList = await profileDataMapper.getUserGamesList(userId);

            res.status(200).json({
                successMessage: result.successMessage,
                isDeleted: true,
                gameDeleted: result.gameId,
                user: {
                    game: gameList.rows,
                },
                accessToken: req.bearerToken
            });
        } catch (error) {
            res.status(403).json({ isDeleted: false, errorMessage: error , accessToken: req.bearerToken});
        }
    }
}

module.exports = profileController;