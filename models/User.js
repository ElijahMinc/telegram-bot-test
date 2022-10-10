const { model, Schema } = require("mongoose")

const User = new Schema({
  chatId: {
    type: Number,
    unique: true,
  },
  rightAnswers: {
    type: Number,
    default: 0,
  },
  wrongAnswers: {
    type: Number,
    default: 0,
  },
})

const UserModel = model("User", User)

module.exports = UserModel
