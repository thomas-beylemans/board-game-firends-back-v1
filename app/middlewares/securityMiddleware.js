const jwt = require('jsonwebtoken');

const securityMiddleware = {
    checkAccessToken: (req, res, next) => {
        // trying to catch the token from the headers
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        // if the token is not found in the headers
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized request - no token provided'
            });
        }
        
        // trying to decode it
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized request' });
            }
            req.user = user;
            next();
        });
    },
    checkRefreshToken: (req, res, next) => {
        // trying to catch the token from the headers
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // if the token is not found in the headers
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized request'
            });
        }
        
        // trying to decode it
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized request' });
            }
            delete user.iat;
            delete user.exp;
        });
    }
};

module.exports = securityMiddleware;
