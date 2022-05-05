const jwt = require('jsonwebtoken');

const jwtManagement = {
    createToken: (user) => {
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        }
        const options = {
            expiresIn: '1h'
        }
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
    }
}

module.exports = jwtManagement;