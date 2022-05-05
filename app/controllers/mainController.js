const dataMapper = require('../database/dataMapper');
const { createAccessToken } = require('../security/jwtManagement.js');
const { createRefreshToken } = require('../security/jwtManagement.js');

const mainController = {
    home(req, res, next){
        try {
            res.send('Hello World');
        } catch (e) {
            next(e);
        }
    },
    async register(req, res, next){
        try {
            const result = await dataMapper.addOneUser(req.body);
            
            const accessToken = createAccessToken(result);
            // const refreshToken = createRefreshToken(result);

            // TODO: précicer le contenu de la réponse à apporter au front
            res.status(200).json({
                username: result.username,
                accessToken
            });
            // res.status(200).json({username: result.username, accessToken, refreshToken});
        } catch (e) {
            next(e);
        }
    },
    async signIn(req, res, next){
        try {
            const result = await dataMapper.checkUserRegistration(req.body);
            
            if(result.isAuthorized === false) {
                return res.status(401).json({ message: 'Wrong email / password' });
            }
            
            // delete isAuthorized from result to avoid sending it to the client
            delete result.isAuthorized;

            const accessToken = createAccessToken(req.body);
            // const refreshToken = createRefreshToken(req.body);
            //?
            res.status(200).json({username: result.username, accessToken});
            // res.status(200).json({username: result.username, accessToken, refreshToken});
            //?
        } catch (e) {
            next(e);
        }
    },
    async getOneUser(req, res, next){
        try {
            const userId = Number(req.params.userId);
            const result = await dataMapper.getOneUser(userId);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    },

}

module.exports = mainController;