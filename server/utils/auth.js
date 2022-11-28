const jwt = require('jsonwebtoken');
require('dotenv').config()
const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXP;
module.exports = {
    authMiddleware: async function ({req}) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            token = token.split(' ')[1]
        }
        if (!token) {
            return req.session;
        }

        try {
            const data= await jwt.verify(token, secret, {maxAge: expiration});
            req.user = data.payload;
            req.session.user = data.payload;
        } catch {
            console.log('Invalid token');
        }
        // console.log(req.session);
        return req.session;
    },
    signToken: function ({firstName, email, _id}) {
        const payload = {firstName, email, _id};
        return jwt.sign({data: payload}, secret, {expiresIn: expiration});
    },
};
