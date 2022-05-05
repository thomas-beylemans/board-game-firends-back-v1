const express = require('express');

const userRouter = express.Router();
const mainController = require('../controllers/mainController');
const { checkAccessToken } = require('../middlewares/securityMiddleware');
const { checkRefreshToken } = require('../middlewares/securityMiddleware');

userRouter.get('/', mainController.getOneUser);

/**
 * @route POST /api/v1
 */
userRouter.post('/register', mainController.register);
userRouter.post('/sign-in', mainController.signIn);

// TODO: add a sign out route

// userRouter.get('/dashboard', mainController);
userRouter.get('/profile/:userId', checkAccessToken, mainController.getOneUser);
// userRouter.get('/profile/:userId', checkAccessToken, checkRefreshToken, mainController.getOneUser);
// userRouter.get('/refreshToken', checkRefreshToken, mainController.getOneUser);

module.exports = userRouter;