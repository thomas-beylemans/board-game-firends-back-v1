const dataMapper = require('../database/dataMapper');
const { createToken } = require('../security/jwtManagement.js');

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
            console.log(req.body);
            const result = await dataMapper.addOneUser(req.body);
            
            const accessToken = createToken(req.body);

            res.status(200).json({result, accessToken});
        } catch (e) {
            next(e);
        }
    },
    async signIn(req, res, next){
        try {
            const result = await dataMapper.checkUserRegistration(req.body);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    },
    async getOneUser(req, res, next){
        try {
            const userId = Number(req.params.userId);
            const result = await dataMapper.getOneUser(userId);
            console.log(result);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    },

}

module.exports = mainController;