'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    User.init({
        goodsId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: DataTypes.STRING,
        thumnailUrl: DataTypes.STRING,
        category: DataTypes.STRING,
        price:DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Goods',
    });
    return User;
};

// const mongoose = require("mongoose");
//
// const GoodsSchema = new mongoose.Schema({
//     name: String,
//     thumbnailUrl: String,
//     category: String,
//     price: Number,
// });
// GoodsSchema.virtual("goodsId").get(function () {
//     return this._id.toHexString();
// });
// GoodsSchema.set("toJSON", {
//     virtuals: true,
// });
// module.exports = mongoose.model("Goods", GoodsSchema);