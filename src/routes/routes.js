//routes.js
const express = require('express');
const router = express.Router();
const dummy = require('../controllers/dummyController.js');

const check = require('../controllers/checkController.js');
const signUp = require('../controllers/signUpController.js');
const login = require('../controllers/loginController.js');
const authorization = require('../middlewares/authorization.js');
const logout = require('../controllers/logoutController.js');
const protect = require('../middlewares/protect.js');
const getproducts = require('../controllers/getProductsController.js');
// routes
router.get('/check', check);
router.post('/signup', authorization, protect, signUp);
router.post('/login', login);
router.post('/dummy',authorization, dummy);
router.post('/logout', authorization, logout);
router.get('/getProducts', authorization, getproducts);
module.exports = router;