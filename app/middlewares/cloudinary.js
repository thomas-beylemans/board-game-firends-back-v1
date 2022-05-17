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
        // await cloudinary.uploader.upload(__dirname + '/../../ressources/306452.jpg', {
        //     folder: 'images',
        //     public_id: '306452',
        //     overwrite: false
        // console.log(picture);
        
        const result = await cloudinary.uploader.upload(__dirname + '/../../.uploads/'+picture, {
            folder: 'images',
            public_id: uuid.v1(),
            overwrite: true
        }, (err, result) => {
            if (err) {
                throw err;
            }
        });
        return result.secure_url;
    }
};

module.exports = cloudinaryPersonalMethods;