const express = require('express');
const authRouter = require('./routers/auth.router.js');
const userRouter = require('./routers/user.router.js');
const productRouter = require('./routers/products.router.js');
const { Users } = require('./models');
const authMiddleware = require('./middlewares/auth.middle.js');
// const product = require('./models/product.js');

const db = require('./models/index.js');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// const token = jwt.sign({ myPayloadData: 1234 }, 'mysecretkey', {
//     expiresIn: '12h',
// });
// console.log(token);

db.sequelize
    .sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch(err => {
        console.error(err);
    });

// users.associate(db);
// product.associate(db);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const decodeToken = jwt.decode(token);
// // jwt Payload를 확인하기 위해 사용됨.

// const verifyToken = jwt.verify(token, 'mysecretkey');
// 여기서 시크릿키를 잘못입력하면 오류가됨. 실제로 jwt 검증시에 비밀키가 일치 해야만 정상적으로 작동하는 것.

// console.log(verifyToken);

app.use('/api/auth', authRouter);
app.use('/api', productRouter);
app.use('/api', userRouter);
// app.use('/api/users', authMiddleware, userRouter); // authMiddleware를 등록
// app.use('/api/products', authMiddleware, productRouter); // authMiddleware를 등록

app.listen(port, () => {
    console.log(`Server is listening.... on ${port}`);
});
