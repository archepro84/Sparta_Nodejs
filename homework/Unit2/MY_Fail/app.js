const express = require("express");
const User = require("./models/user");
const jwt = require('jsonwebtoken');
const Goods = require('./schemas/goods');
const Cart = require('./schemas/cart');
const authMiddleware = require('./middlewares/auth-middleware');

const app = express();
const router = express.Router();
//
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

const connect = require('./schemas');

connect();

const goodsRouter = require("./routers/goods");
app.use("/api", [goodsRouter]);

router.post("/users", async (req, res) => {
    // console.log(req.body);
    const {nickname, email, password, confirmPassword} = req.body;

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다."
        })
        return; // 아래의 코드가 필요없기 때문에 멈춘다.
    }

    const existUsers = await User.find({
        // 해당하는 값이 하나라도 있으면 데이터를 가지고 온다.
        $or: [{email}, {nickname}],
    })

    if (existUsers.length) {
        res.status(400).send({
            errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다."
        })
        return;
    }
    const user = new User({email, nickname, password});
    await user.save();

    //send 반환시 기본으로 http Status를 200으로 준다.
    res.status(201).send({});

});

router.post("/auth", async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email, password}).exec();
    if (!user) {
        res.status(400).send({
            errorMessage: "이메일 또는 패스워드가 잘못 됐습니다 ."
        });
        return;
    }
    const token = jwt.sign({userId: user.userId}, "my-secret-ket-kkk")
    res.send({
        token,
    })
});
router.get("/users/me", authMiddleware, async (req, res) => {
    const {user} = res.locals
    // console.log(user);
    res.send({user});
});

app.use("/api", express.urlencoded({extended: false}), router);
app.use(express.static("assets"));

app.listen(8080, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
});