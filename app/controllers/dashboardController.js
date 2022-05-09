const cloudinaryPersonalMethods = require('../middlewares/importPicture');


const dashboardController = {
    uploadPicture: async function(req, res) {
        const picture = req.file;
        console.log(picture);
        // const pictureUrl = await cloudinaryPersonalMethods.uploadPicture(picture);
        return res.status(200).json({
            // secureURL: pictureUrl.secure_url
        });

        const result = await cloudinaryPersonalMethods.uploadPicture(req.file);
        res.send(result.secure_url);
    }
}

module.exports = dashboardController;


// import multer from 'multer';
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// server.post('/api/images', upload.any(), async (req, res) => {
//    ...
// }