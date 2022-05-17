const userDataMapper = require('../dataMapper/userDataMapper');
const { createAccessToken } = require('../security/jwtManagement.js');

const userController = {
    async register(req, res, next){
        try {
            if (!req.body.hasOwnProperty('user') || Object.keys(req.body.user).length === 0) {
                throw `Données utilisateurs absentes.`;
            }
            else if (!req.body.user.hasOwnProperty('avatar') || req.body.user.avatar === '' || req.body.user.avatar === null) {
                req.body.user.avatar = `https://res.cloudinary.com/board-game-friends/image/upload/v1652777587/images/default_profile_picture.jpg`;
            }
            const result = await userDataMapper.addOneUser(req.body.user);
            const accessToken = await createAccessToken(result);
            
            // push the accessToken in req in case of next middleware
            req.userToken = accessToken;
            // TODO: précicer le contenu de la réponse à apporter au front
            res.status(201).json({
                successMessage: 'Utilisateur créé avec succès !',
                isUserCreated: true,
                accessToken
            });
        } catch (error) {
            res.status(400).json({ isUserCreated: false, errorMessage: error });
        }
    },
    async signIn(req, res, next){
        try {
            const result = await userDataMapper.checkUserRegistration(req.body);
            
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
            res.status(401).json({ errorMessage: error });
        }
    }
}

module.exports = userController;