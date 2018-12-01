var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const user = mongoose.model(
  "User",
  new Schema({
    email: String,
    password: String
  })
);

module.exports = user;
