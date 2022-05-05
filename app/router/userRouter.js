const express = require('express');

const userRouter = express.Router();
const mainController = require('../controllers/mainController');
const { checkToken } = require('../middlewares/securityMiddleware');

userRouter.get('/', mainController.getOneUser);

/**
 * @route POST /api/v1
 */
userRouter.post('/register', mainController.register);
userRouter.post('/sign-in', mainController.signIn);

// TODO: add a sign out route

// userRouter.get('/dashboard', mainController);
userRouter.get('/profile/:userId', checkToken, mainController.getOneUser);

module.exports = userRouter;