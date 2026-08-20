//routes.js
const express = require('express');
const router = express.Router();

const check = require('../controllers/checkController.js');

// routes
router.get('/check', check)

module.exports = router;