//start server
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//process cookies
app.use(cookieParser());
app.use('/api', routes);

module.exports = app;