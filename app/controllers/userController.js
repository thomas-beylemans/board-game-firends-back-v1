const dataMapper = require('../database/dataMapper');
const { createAccessToken } = require('../security/jwtManagement.js');

const userController = {
    async register(req, res, next){
        try {
            const result = await dataMapper.addOneUser(req.body);
            
            const accessToken = createAccessToken(result);

            // TODO: précicer le contenu de la réponse à apporter au front
            res.status(200).json({
                username: result.username,
                accessToken
            });
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
            //?
            res.status(200).json({username: result.username, accessToken});
            //?
        } catch (e) {
            next(e);
        }
    }
}

module.exports = userController;