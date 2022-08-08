const express = require('express');
const routing = express.Router();
const userCtrl = require('../controllers/user');
const multer = require('../middleware/multer-config')

routing.post('/signup', userCtrl.signup);
routing.post('/login', userCtrl.login)
routing.get('/userInfo/:id', userCtrl.getInfo)
routing.put('/modifyProfil/:id',multer, userCtrl.modifyProfilPic)

module.exports = routing;