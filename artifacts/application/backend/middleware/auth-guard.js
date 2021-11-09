const jwt = require('jsonwebtoken');
const Constants = require('../libs/Constants');
const config = require('../config');
const ReturnResult = require('../libs/ReturnResult');


module.exports = (req, res, next) => {
    try {
        var token = req.headers.authorization;
        if (token && token.split(' ')[0] === 'Bearer')
            token = token.split(' ')[1];
        const decodedToken = jwt.verify(token, config.get('jwt.TOKEN_KEY'));
        req.userData = {
            email: decodedToken.email,
            org: decodedToken.org,
        };
        console.log("[AUTH-GUARD MIDDLEWARE]: SUCCESS");
        next();
    } catch (error) {
        console.log("[AUTH-GUARD MIDDLEWARE]: FAILED -> " + error.message);
        res.status(401).json(
        new ReturnResult(error, null, null, `JWT Error: ${error.message}`)
        );
    }
};