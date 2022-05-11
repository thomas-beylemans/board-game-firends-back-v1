const dataMapper = require('../database/dataMapper');
const { createAccessToken } = require('../security/jwtManagement.js');

const userController = {
    async register(req, res, next){
        try {
            const result = await dataMapper.addOneUser(req.body);
            console.log(result);
            
            const accessToken = await createAccessToken(result);
            
            // push the accessToken in req in case of next middleware
            console.body('accessToken:');
            console.log(accessToken);
            req.userToken = accessToken;
            // TODO: précicer le contenu de la réponse à apporter au front
            res.status(201).json({
                accessToken
            });
        } catch (error) {
            res.status(401).json({ errorMessage: error.detail});
        }
    },
    async signIn(req, res, next){
        try {
            const result = await dataMapper.checkUserRegistration(req.body);
            
            if(result.isAuthorized === false) {
                throw `Erreur de saisie de l'email ou du mot de passe !`;
            }
            
            // delete isAuthorized from result to avoid sending it to the client
            delete result.isAuthorized;
            
            const accessToken = await createAccessToken(result);
            //?
            res.status(200).json({ accessToken });
            //?
        } catch (error) {
            res.status(401).json(error);
            // res.status(401).json({ errorMessage: error });
        }
    }
}

module.exports = userController;