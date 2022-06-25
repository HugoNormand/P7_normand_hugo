const express = require('express');
const routing = express.Router();
const userCtrl = require('../controllers/user');

routing.post('/signup', userCtrl.signup);
routing.post('/login', userCtrl.login)

module.exports = routing;