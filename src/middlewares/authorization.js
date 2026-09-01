//check access token and verify it
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authorization = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token:", token);
    console.log(req.headers.cookies)
    console.log(req.headers)
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Decoded user:", req.user);
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token. Please login again." });
    }
};

module.exports = authorization;