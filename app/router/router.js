const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');
const eventController = require('../controllers/eventController');
const { checkAccessToken } = require('../middlewares/securityMiddleware');

/**
 * @route POST /api/v1
 */
router.get('/', (req, res) => { res.send('Hello World') });

router.post('/register', userController.register);
router.post('/sign-in', userController.signIn);

// TODO: add a sign out route

router.get('/dashboard', checkAccessToken, profileController.getDashboard);
router.patch('/profile', checkAccessToken, profileController.updateProfile);

router.post('/profile/my-games', checkAccessToken, profileController.addGame);
router.delete('/profile/my-games', checkAccessToken, profileController.deleteGame);

router.get('/profile/:profileId', checkAccessToken, profileController.getProfileById);

// // events?city=nantes
// // events?city=nantes&date=2020-01-01 => have a look on the search by date functionnality
router.get('/events', checkAccessToken, eventController.getEvents);
router.post('/events', checkAccessToken, eventController.addEvent);

router.get('/events/:id', checkAccessToken, eventController.getEventById);
router.post('/events/:id/subscribe', checkAccessToken, eventController.subscribeEventById);
router.delete('/events/:id/subscribe', checkAccessToken, eventController.unsubscribeEventById);


module.exports = router;