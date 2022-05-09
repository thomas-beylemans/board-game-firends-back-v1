const jwt = require('jsonwebtoken');

const jwtManagement = {
    createAccessToken: async(user) => {
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        }
        const options = {
            expiresIn: '96h'
        }
        return (await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options));
    }
}

module.exports = jwtManagement;