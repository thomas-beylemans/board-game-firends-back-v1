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