// auth.middle.js

const jwt = require('jsonwebtoken');
const ErrorResult = require('../util/error/error.js');
const userModel = require('../models/user.js');
/**
 * 인증 미들웨어
 */
module.exports = async function (req, res, next) {
    const { authorization } = req.headers;
    console.log(authorization);

    if (authorization === undefined || authorization === null) {
        return res.status(400).json(ErrorResult.errorAuthToken());
    }

    const requestAuthToken = authorization.split(' ')[1];
    console.log(requestAuthToken);
    let resultAuth;
    try {
        resultAuth = jwt.verify(requestAuthToken, process.env.JWT_KEY);
    } catch (err) {
        console.log(err);
        return res.status(400).json(ErrorResult.errorAuthToken());
    }

    req.user = resultAuth.userid;
    console.log(req.user);
    next();
};
