const jwt = require('jsonwebtoken')
const {User} = require('../models') //index.js를 통해 User를 가지고 옴
module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');
    if (tokenType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요."
        })
        return;
    }
    try {

        const {userId} = jwt.verify(tokenValue, "my-secret-key")

        //UserId 로 Primary Key를 검색한다.
        User.findByPk(userId).then((user) => {
            res.locals.user = user;
            // console.log(res.locals.user);
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요."
        })
        return;
    }
}