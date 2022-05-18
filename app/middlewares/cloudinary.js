const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uuid = require('uuid');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const cloudinaryPersonalMethods = {
    uploadPicture: async function(picture) {
        const imgTempLocation = __dirname + '/../../.uploads/'+picture;
        const result = await cloudinary.uploader.upload(imgTempLocation, {
            folder: 'images',
            public_id: uuid.v1(),
            overwrite: true
        }, (err, result) => {
            // delete the local file
            fs.unlink(imgTempLocation, function (err) {
                if (err) throw err;
            });

            // handle cloudinary error
            if (err) {
                throw err;
            }
        });
        return result.secure_url;
    }
};

module.exports = cloudinaryPersonalMethods;