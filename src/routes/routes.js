//routes.js
const express = require('express');
const router = express.Router();

const check = require('../controllers/checkController.js');
const signUp = require('../controllers/signUpController.js');
const login = require('../controllers/loginController.js');

// routes
router.get('/check', check);
router.post('/signup', signUp);
router.post('/login', login);

module.exports = router;