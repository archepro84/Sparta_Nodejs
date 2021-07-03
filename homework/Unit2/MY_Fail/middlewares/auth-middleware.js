const jwt = require('jsonwebtoken')
const User = require('../models/user')
module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    // console.log(authorization);
    const [tokenType, tokenValue] = authorization.split(' ');
    // console.log(authorization);
    if (tokenType !== "Bearer") {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요."
        })
        return;
    }
    try {
        
        const {userId} = jwt.verify(tokenValue, "my-secret-ket-kkk")
        User.findById(userId).exec().then((user) => {
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