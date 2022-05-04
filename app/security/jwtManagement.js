const jwt = require('jsonwebtoken');

const jwtManagement = {
    createToken: (user) => {
        const payload = {
            user: {
                id: user.user.id,
                email: user.user.email,
                username: user.user.username
            }
        }
        const options = {
            expiresIn: '1h'
        }
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
    }
}

module.exports = jwtManagement;