//login controller
const users = require("../models/users.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config(); 

const loginController = async (req, res) => {

    //connect to DB
 

const { email, password } = req.body;
//check if user exists
const user = await users.findOne({ email: email });
console.log(user);
if (!user) {
    return res.status(400).json({ message: "User does not exist" });
}
else {
    //compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }
    else{
    
         
         const NDBNAME = email.split("@")[0];
         //remove special characters from the database name
         const cleanNDBNAME = NDBNAME.replace(/[^a-zA-Z0-9]/g, "");

        
        //generate access token and send it to the user in cookies
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", path: "/", maxAge: 3600000 });
        res.status(200).json({ message: `User logged in successfully database: ${cleanNDBNAME}` , user: user });

}
}
}

module.exports = loginController;