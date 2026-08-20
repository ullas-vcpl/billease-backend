//login controller
const users = require("../models/users.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 
const dotenv = require('dotenv');
dotenv.config(); 


const loginController = async (req, res) => {
    const { email, password } = req.body;
    // Check if user exists
    await users.findOne({ email: email }).then(async (user) => {
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        } else {
            // Compare password
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            } else {
                res.status(200).json({ message: "Login successful", user: user });
                //connectDatabase;
                const DBNAME = email.split("@")[0];
                 await mongoose.connect(process.env.DBURL, {
                 dbName: DBNAME
                })

            }
        }
    });
}   

module.exports = loginController;