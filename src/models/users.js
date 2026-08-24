//user model

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  firmname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
    immutable: true

  }

});
const db=mongoose.connection.useDb("Admin_DB",{useCache:true});
const users = db.models.user || db.model("User", userSchema);
module.exports = users;