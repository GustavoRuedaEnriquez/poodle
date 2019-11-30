'use strict'

const express = require('express');
const UserController = require('../controllers/user');

let api = express.Router();

api.post('/login',UserController.login);
api.post('/user', UserController.addUser);
api.get('/users',UserController.getUsers);
api.get('/user/:id',UserController.getUserById);
api.patch('/user/:email',UserController.updateUser);

module.exports = api;