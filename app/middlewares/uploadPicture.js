const multer  = require('multer')
const cloudinaryPersonalMethods = require('./cloudinary');
const storage = multer.diskStorage(
    {
        destination: './.uploads/',
        filename: async function ( req, file, cb ) {
            const globalFileName = req.userToken.user.id + '-' + file.originalname;
            cb( null, globalFileName );
            
            req.avatar = await cloudinaryPersonalMethods.uploadPicture(globalFileName);
            console.log(req.avatar);
        }
    }
);
const upload = multer({
    // dest: './app',
    // // originalname: true,
    // filename: true,
    // preservePath: true,
    storage: storage
});

module.exports = upload;