//routes.js
const express = require('express');
const router = express.Router();
const dummy = require('../controllers/dummyController.js');

const check = require('../controllers/checkController.js');
const signUp = require('../controllers/signUpController.js');
const login = require('../controllers/loginController.js');
const authorization = require('../middlewares/authorization.js');
const logout = require('../controllers/logoutController.js');
// routes
router.get('/check', check);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/dummy',authorization, dummy);
router.post('/logout', authorization, logout);
module.exports = router;