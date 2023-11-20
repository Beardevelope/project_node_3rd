const jwt = require('jsonwebtoken');
const ErrorResult = require('../util/error/error.js');

/**
 * 인증 미들웨어
 */
module.exports = function (req, res, next) {
    const { authorization } = req.headers;

    if (authorization === undefined || authorization === null) {
        return res.status(400).json(ErrorResult.errorAuthToken());
    }

    const requestAuthToken = authorization.split(' ');

    let resultAuth;
    try {
        resultAuth = jwt.verify(requestAuthToken[1], process.env.JWT_KEY);
    } catch (err) {
        console.log(err);
        return res.status(400).json(ErrorResult.errorAuthToken());
    }

    req.user = resultAuth.userid;

    next();
};
