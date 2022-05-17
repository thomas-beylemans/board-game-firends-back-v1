// const express = require('express');
const multer  = require('multer');

const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, './.uploads/');
        },
        filename: async function ( req, file, callback ) {
            req.globalFileName = req.userToken.user.id + '-' + file.originalname;
            callback(null, req.globalFileName);
        }
    }
);
const upload = multer({
    // dest: './app',
    // // originalname: true,
    // filename: true,
    // preservePath: true,
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            callback(null, true)
        } else {
            callback(null, false)
            return callback(new Error('Only .png, .jpg, .mp4 and .jpeg format allowed!'))
        }
    }
}).single('picture');

module.exports = (req, res, next) => {
    return upload (req, res, (err) => {
        if (err) {
            return res.status(400).json({
                errorMessage: err.message
            });
        }
        next();
    });
}