'use strict'

const express = require('express');
const UserController = require('../controllers/user');
const mdAuth = require('../middlewares/authenticate');

let api = express.Router();

api.post('/login',UserController.login);
api.post('/user', UserController.addUser);
api.get('/users',UserController.getUsers);
api.get('/user/:id',UserController.getUserById);
api.patch('/user/:email',mdAuth.ensureAuth,UserController.updateUser);

module.exports = api;