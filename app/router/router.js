const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');
const dashboardController = require('../controllers/dashboardController');
const { checkAccessToken } = require('../middlewares/securityMiddleware');
const multer  = require('multer')
const storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function ( req, file, cb ) {
            cb( null, file.originalname );
        }
    }
);
const upload = multer({
    // dest: './app',
    // // originalname: true,
    // filename: true,
    // preservePath: true,
    storage: storage
})

/**
 * @route POST /api/v1
 */
router.get('/', (req, res) => {
    res.send('Hello World');
    require('../middlewares/importPicture');
});

router.post('/register', userController.register);
router.post('/sign-in', userController.signIn);

// TODO: add a sign out route

router.get('/dashboard', checkAccessToken, profileController.getDashboard);
router.post('/dashboard', upload.single('picture'), dashboardController.uploadPicture);
// router.patch('/profile', checkAccessToken, profileController.updateProfile);
// router.delete('/profile', checkAccessToken, profileController.deleteProfile);

// router.get('/profile/my-games', checkAccessToken, profileController.getMyGames);
// router.post('/profile/my-games', checkAccessToken, profileController.addGame);
// router.delete('/profile/my-games/:id', checkAccessToken, profileController.deleteGame);

router.get('/profile/:profileId', checkAccessToken, profileController.getProfileById);

// // events?city=nantes
// // events?city=nantes&date=2020-01-01 => have a look on the search by date functionnality
// router.get('/events', checkAccessToken, eventController.getEvents);
// router.post('/events', checkAccessToken, eventController.addEvent);

// router.get('/events/:id', checkAccessToken, eventController.getEventById);
// router.patch('/events/:id', checkAccessToken, eventController.updateEvent);
// router.post('/events/:id/subscribe', checkAccessToken, eventController.subscribeToEventById);
// router.delete('/events/:id/subscribe', checkAccessToken, eventController.unsubscribeToEventById);

// router.get('/profile/:userId', checkAccessToken, mainController.getOneUser);

module.exports = router;