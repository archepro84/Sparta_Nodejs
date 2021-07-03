const express = require("express");
const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");

const app = express();
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');


router.get("/goods", authMiddleware, async (req, res, next) => {
    console.log(`get /goods`);
    try {
        const {category} = req.query;
        // 몽고디비에 있는 goodsId 기준으로 정렬 시켜서 가져온다.(-) : 역순
        const goods = await Goods.find({category}).sort("-_id");
        // console.log(`goods : ${goods}`);
        // json 형식으로 가져온다.
        res.json({goods: goods});
    } catch (err) {
        console.error(err);
        next(err);
    }
});
//
// router.get("/goods/:_id", authMiddleware, async (req, res) => {
//     console.log(`get /goods:_id`);
//     const _id = req.params._id;
//     console.log(_id);
//     const result = await Goods.findOne({_id})
//
//     res.send({goods: result})
// });

//goods 안에 있는 goodsId의 카트를 담는다.
router.post("/goods/:goodsId/cart", async (req, res) => {
    console.log('/goods/:goodsId/cart');

    const {goodsId} = req.params;
    //수량을 담아서 온다.
    const {quantity} = req.body;


    //해당 상품이 이미 들어있는지 확인
    isCart = await Cart.find({goodsId});
    console.log("Jun");
    console.log(isCart, quantity);


    if (isCart.length) {
        await Cart.updateOne({goodsId}, {$set: {quantity}});
    } else {
        //카트가 아직 비어있는 경우
        await Cart.create({goodsId: goodsId, quantity: quantity});
    }
    res.send({result: "success"});
});

//goods 안에 있는 goodsId의 카트를 담는다.
router.put("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
    console.log("put /goods/:goodsId/cart");
    const goodsId = req.params.goodsId;
    const {quantity} = req.headers

    //해당 상품이 이미 들어있는지 확인
    isCart = await Cart.find({goodsId});
    console.log(isCart, quantity);


    if (isCart.length) {
        await Cart.updateOne({goodsId}, {$set: {quantity}});
    } else {
        //카트가 아직 비어있는 경우
        await Cart.create({goodsId: goodsId, quantity: quantity});
    }
    res.send({result: "success"});
});

router.delete("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
    console.log(`delete /goods/:goodsId/cart`);
    const {goodsId} = req.params;
    //장바구니에 goodsId인게 있는지 확인한다.
    const isGoodsInCart = await Cart.find({goodsId});

    if (isGoodsInCart.length > 0) {
        await Cart.deleteOne({goodsId});
    }
    res.send({result: "Success"});
})

router.patch("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
    console.log(`patch /goods/:goodsId/cart`);
    const {goodsId} = req.params;
    const {quantity} = req.body;

    //상품이 있는지 체크
    const isGoodsInCart = await Cart.find({goodsId});
    if (isGoodsInCart.lenght > 0) {
        await Cart.updateOne({goodsId}, {$set: {quantity}})
    }

    res.send({result: "Success"})

})

router.get("/cart", authMiddleware, async (req, res) => {
    console.log(`get cart`);
    const cart = await Cart.find({});
    //어떤 goodsId가 있는지 가져옴.
    const goodsId = cart.map(cart => cart.goodsId);

    goodsInCart = await Goods.find()
        //장바구니에 담겨있는 goodsId를 가지고 온다.
        .where("goodsId")
        .in(goodsId);

    concatCart = cart.map(c => {
        for (let i = 0; i < goodsInCart.length; i++) {
            if (goodsInCart[i].goodsId == c.goodsId) {
                //상품에 대한 실제 정보를 담아준다.
                return {quantity: c.quantity, goods: goodsInCart[i]};
            }
        }
    });

    res.json({
        cart: concatCart
    });
});

router.get("/goods/cart", authMiddleware, async (req, res) => {
    console.log("HEllo get Cart");
    const cart = await Cart.find({});
    console.log(cart);
    //어떤 goodsId가 있는지 가져옴.
    const goodsId = cart.map(cart => cart.goodsId);
    console.log("Test1");

    // goodsInCart = await Goods.find()
    //     //장바구니에 담겨있는 goodsId를 가지고 온다.
    //     .where("goodsId")
    //     .in(goodsId);
    const goodsInCart = await Goods.find({_id: goodsId})
    console.log("Test2");

    concatCart = cart.map(c => {
        for (let i = 0; i < goodsInCart.length; i++) {
            if (goodsInCart[i].goodsId == c.goodsId) {
                //상품에 대한 실제 정보를 담아준다.
                return {quantity: c.quantity, goods: goodsInCart[i]};
            }
        }
    });
    
    console.log("Test3");
    console.log(goodsInCart);

    res.json({goodsInCart});
});

router.get('/detail/:_id', authMiddleware, (req, res) => {
    console.log(`get /detail/:_id`);
    const _id = req.params['_id']
    console.log(`detail/:_id : ${_id}`);
    res.render('detail');
})

module.exports = router