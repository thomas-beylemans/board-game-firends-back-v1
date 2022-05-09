const jwt = require('jsonwebtoken');

const securityMiddleware = {
    checkAccessToken: (req, res, next) => {
        // trying to catch the token from the headers
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        // bearer token ready to be sent for the next one
        req.bearerToken = token;

        // if the token is not found in the headers
        if (!token) {
            return res.status(401).json({
                errorMessage: 'Accès interdit, il faut être indentifié !'
            });
        }
        
        // trying to decode it
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ errorMessage: 'Accès interdit, il faut être indentifié !' });
            }
            req.userToken = user;
            next();
        });
    }
};

module.exports = securityMiddleware;
