//check if admin is logging in and if yes then allow him to login otherwise deny access

const users = require("../models/users.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const protect = async (req, res, next) => {
    await mongoose.connection.close();
    const DBNAME = "Admin_DB";
    //connect to DB
    await mongoose.connect(process.env.DBURL, {
  dbName: DBNAME
});
   user = await users.findOne({ _id: req.user.id });
   if (user.isAdmin) {
    next();
    }

    else {
        return res.status(403).json({ message: "Access denied. Only admin can sign up." });
    }
}

module.exports = protect;