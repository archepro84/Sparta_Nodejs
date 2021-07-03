const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    value: String,
    doneAt: Date, // 체크를 한 시간을 확인해야 한다.
    order: Number, //항일 목록을 추가 할때마다 순서가 바뀐다.
});

TodoSchema.virtual("todoId").get(function () {
    return this._id.toHexString();
})
TodoSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Todo", TodoSchema);
