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
        userId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        goodsId: DataTypes.STRING,
        quantity:DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Cart',
    });
    return User;
};


// const mongoose = require("mongoose");
//
// const CartSchema = new mongoose.Schema({
//     userId: String,
//     goodsId: String,
//     quantity: Number,
// });
// module.exports = mongoose.model("Cart", CartSchema);