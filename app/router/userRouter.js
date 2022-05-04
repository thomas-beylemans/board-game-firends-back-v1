const express = require('express');


const userRouter = express.Router();
const mainController = require('../controllers/mainController');

userRouter.get('/', mainController.getOneUser);

/**
 * @route POST /api/v1
 */
userRouter.post('/register', mainController.register);
userRouter.post('/signin', mainController.signIn);

// userRouter.get('/dashboard', mainController);
userRouter.get('/profile/:userId', mainController.getOneUser);

module.exports = userRouter;