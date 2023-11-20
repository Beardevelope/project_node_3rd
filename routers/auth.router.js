const express = require('express');
const bcrypt = require('bcrypt'); // bcrypt 모듈 불러오기 추가
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const ErrorResult = require('../util/error/error.js');
const SuccessResult = require('../util/success/success.js');
const { Users } = require('../models'); // 모듈 가져오기 추가
const router = express.Router();
const {
    ValidatePassword,
    ValidateEmail,
} = require('../util/validation/auth.validation.js');
const dotenv = require('dotenv');
dotenv.config(); // dotenv 환경 변수 로드
// const { User } = require('./models/user.js');

// 회원가입
router.post('/signup', async (req, res) => {
    const { email, password, passwordConfirm, name } = req.body;

    if (!ValidatePassword.validatePasswordLength(password)) {
        return res.status(400).json(ErrorResult.errorPasswordLength());
    }
    if (!ValidatePassword.validateEqualPassword(password, passwordConfirm)) {
        return res.status(400).json(ErrorResult.errorNotEqualPassword());
    }

    let selectUser;
    try {
        selectUser = await Users.findOne({
            where: {
                email, // 수정: user_email -> email
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json(ErrorResult.errorServer());
    }

    if (selectUser) {
        return res.status(400).json(ErrorResult.errorDuplicatingEmail());
    }
    if (!ValidateEmail.validateConfirmEmail(email)) {
        return res.status(400).json(ErrorResult.errorBadPatternEmail());
    }

    try {
        let resultUser = await Users.create({
            email,
            name,
            password: bcrypt.hashSync(password, 10),
            // compare.sync(password, 10), bcrypt 사이트를 확인해보자.
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json(ErrorResult.errorServer());
    }

    return res
        .status(201)
        .json({ message: '회원이 정상적으로 등록 완료되었습니다.' });
});

// 로그인

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let selectUser;
    try {
        selectUser = await Users.findOne({
            where: {
                email,
            },
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json(ErrorResult.errorServer());
    }

    if (!selectUser) {
        return res.status(400).json(ErrorResult.errorEmptyEmail());
    }

    const comparePassword = await bcrypt.compare(
        password,
        selectUser.dataValues.password,
    );
    if (!comparePassword) {
        return res.status(400).json(ErrorResult.errorNotEqualPassword());
    }

    // jwt 발급
    const token = jwt.sign(
        {
            userid: selectUser.dataValues.id,
        },
        process.env.JWT_KEY,
        {
            expiresIn: '12h',
        },
    );

    res.status(200)
        .header({ authorization: `Bearer ${token}` })
        .json(SuccessResult.successLogin(token));
});
// 모듈 내보내기
module.exports = router;
