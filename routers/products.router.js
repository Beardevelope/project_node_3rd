const express = require('express');
const User = require('../models/user.js');
const Product = require('../models/product.js');
const SuccessResult = require('../util/success/success.js');
const ErrorResult = require('../util/error/error.js');
const { where } = require('sequelize');

const router = express.Router();

/**
 * 상품 등록 API
 */
router.post('/product', async (req, res) => {
    const { product_name, product_description, product_state } = req.body;

    if (req.user === undefined || req.user === null) {
        return res.status(400).json(ErrorResult.errorAuthToken());
    }

    let createResult;
    try {
        createResult = await Product.create({
            product_name,
            product_description,
            product_state,
            user_id: req.user,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json(ErrorResult.errorServer());
    }

    res.status(201).json(
        SuccessResult.success(
            createResult,
            '상품등록이 정상적으로 완료되었습니다.',
        ),
    );
});

/**
 * 상품 수정 API
 */
router.patch('/product/:productId', async (req, res) => {
    const { productId } = req.params;
    const { product_name, product_description, product_state } = req.body;

    const selectProduct = await Product.findOne({
        where: {
            id: productId,
        },
    });

    if (!selectProduct) {
        return res.status(400).json(ErrorResult.errorEmptyProduct());
    }
    if (selectProduct.dataValues.user_id !== req.user) {
        return res.status(400).json(ErrorResult.errorNotEqualUser());
    }

    try {
        await Product.update(
            {
                product_name,
                product_description,
                product_state,
            },
            {
                where: {
                    id: productId,
                },
            },
        );
    } catch (err) {
        console.log(err);

        return res.status(500).json(ErrorResult.errorServer());
    }

    res.status(200).json(SuccessResult.success(null, '수정이 완료되었습니다.'));
});

/**
 * 상품 삭제 API
 */
router.delete('/product/:productId', async (req, res) => {
    const { productId } = req.params;

    const selectProduct = await Product.findOne({
        where: {
            id: productId,
        },
    });

    if (!selectProduct) {
        return res.status(400).json(ErrorResult.errorEmptyProduct());
    }
    if (selectProduct.dataValues.user_id !== req.user) {
        return res.status(400).json(ErrorResult.errorNotEqualUser());
    }

    try {
        await Product.destroy({
            where: {
                id: productId,
            },
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json(ErrorResult.errorServer());
    }

    res.status(200).json(SuccessResult.success(null, '삭제가 완료되었습니다.'));
});

/**
 * 상품 목록 조회 API
 */
router.get('/products', async (req, res) => {
    const { sort } = req.query;

    const selectProducts = await Product.findAll({
        attributes: [
            'id',
            'product_name',
            'product_description',
            'product_state',
            'createdAt',
        ],
        include: [
            {
                model: User,
                attributes: ['user_name'],
            },
        ],
        order: [['createdAt', sort.toUpperCase()]],
    });

    res.status(200).json(
        SuccessResult.success(selectProducts, '목록조회를 성공했습니다.'),
    );
});

/**
 * 상품 상세 조회 API
 */
router.get('/product/:productId', async (req, res) => {
    const { productId } = req.params;

    const selectProduct = await Product.findOne({
        attributes: [
            'id',
            'product_name',
            'product_description',
            'product_state',
            'createdAt',
        ],
        where: {
            id: productId,
        },
        include: [
            {
                model: User,
                attributes: ['user_name'],
            },
        ],
    });

    if (!selectProduct) {
        return res.status(400).json(ErrorResult.errorEmptyProduct());
    }

    res.status(200).json(
        SuccessResult.success(selectProduct, '상세조회를 성공하였습니다.'),
    );
});

module.exports = router;
