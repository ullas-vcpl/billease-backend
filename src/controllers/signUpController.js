// signup controller
const users = require("../models/users.js");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");

const signUpController = async (req, res) => {
    const DBNAME = "ullas";
    //connect to DB
    await mongoose.connect(process.env.DBURL, {
  dbName: DBNAME
});
    const { name, firmname, email, password } = req.body;
    // Check if user already exists
    users.findOne({ email: email }).then(async (user) => {
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        } else {
            // Create new user
            //bcrypt password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = new users({
                name,
                firmname,
                email,
                password: hashedPassword,
            });
            // connect to DB
  
            await newUser.save().then((savedUser) => {
                mongoose.connection.close();
                res.status(201).json({ message: "User created successfully", user: savedUser });
            }).catch((err) => {
                res.status(500).json({ error: err.message });
            });
        }
    });
    
};

module.exports = signUpController;