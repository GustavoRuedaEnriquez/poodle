'use strict'

const  moment = require('moment');
let User = require('../models/user');

function addUser(req, res){    
    let user = new User();
    let params = req.body;
    user.username = params.username;
    user.email = params.email;
    user.nombre = params.nombre;
    user.apellido = params.apellido;
    user.date = moment();
    user.position = params.position;
    user.password = params.password;
    user.save((err, storedUser) => {
        if(err){
            res.status(500).send({mesage:'Server error.'});
        } else {
            if(!storedUser){
                res.status(404).send({message:'Error while saving.'});
            } else {
                res.status(201).send({message:'User stored', user : storedUser});
            }
        }
    });
}

function getUsers(req, res){
    User.find({},(err, users) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            console.log(users)
            if(Object.entries(users).length === 0){
                res.status(404).send({message: 'No users found.'});
            }else{
                res.status(200).send({message:'Users obtained', results : users});
            }
        }
    });
}

function getUsersPage(req, res){
    User.find({skip: req.skip, limit: req.limit},(err, users) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(users).length === 0){
                res.status(404).send({message: 'No users found.'});
            }else{
                res.status(200).send({message:'Users obtained', result : users});
            }
        }
    });
}

function getUserById(req,res){
    var userId = req.params.id;
    User.findById(userId,(err,user) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(users).length === 0){
                res.status(404).send({message: 'User not found.'});
            }else{
                res.status(200).send({message:'User obtained', result : user});
            }
        }
    });
}

function getUserByEmail(req,res){
    var userEmail = req.params.email;
    User.find({email: userEmail},(err,user) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(users).length === 0){
                res.status(404).send({message: 'User not found.'});
            }else{
                res.status(200).send({message:'User obtained', result : user});
            }
        }
    });
}


module.exports = {
    addUser,
    getUsers,
    getUsersPage,
    getUserById,
    getUserByEmail
};