'use strict'

const  moment = require('moment');
const jwt = require('../services/jwt');

let User = require('../models/user');

function login(req, res){
    let correo = req.body.email;
    let password = req.body.password;

    if (correo == undefined) {
        res.status(400).send({'message':'Email is missing.'});
    }
    if (password == undefined) {
        res.status(400).send({'message':'Password is missing.'});
    }

    User.findOne({email: correo},(err,user) => {
        if(err){
            console.log(err);
            res.status(500).send({message: 'Server error.'});
        } else {
            if(! user){
                console.log("Not found")
                res.status(404).send({message: 'User not found.'});
            } else {
                if(password == user.password){
                    let token = jwt.createToken(user);
                    res.status(200).send({message: 'Logged in', token : token, User : user});
                } else {
                    res.status(403).send({message: 'Invalid password'});
                }
            }
        }
    });
}

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
            console.log(err);
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
            console.log(err);
            res.status(500).send({message: 'Server error.'});
        }else{
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
            console.log(err);
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
    let userId = req.params.id;
    User.findById(userId,(err,user) => {
        if(err){
            console.log(err);
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(user).length === 0){
                res.status(404).send({message: 'User not found.'});
            }else{
                res.status(200).send({message:'User obtained', result : user});
            }
        }
    });
}

function getUserByUsername(req,res){
    let username = req.params.username;
    User.find({username: username},(err,user) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(user).length === 0){
                res.status(404).send({message: 'User not found.'});
            }else{
                res.status(200).send({message:'User obtained', result : user});
            }
        }
    });
}

function getUserByEmail(req,res){
    let userEmail = req.params.email;
    User.find({email: userEmail},(err,user) => {
        if(err){
            console.log(err);
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(user).length === 0){
                res.status(404).send({message: 'User not found.'});
            }else{
                res.status(200).send({message:'User obtained', result : user});
            }
        }
    });
}

function updateUser(req, res){
  
    let userEmail = req.params.email;
    let update = req.body;

    User.findOneAndUpdate({email: userEmail}, update, {new:true}, (err,updatedUser) =>{
        if(err){
            console.log(err);
            res.status(500).send({message: 'Server error.'});
        }else{
            if(!updatedUser){
                res.status(404).send({message: 'Could not update the user.'});
            }else{
                res.status(200).send({message:'User updated', result : updatedUser})
            }
        }
    });
}

module.exports = {
    login,
    addUser,
    getUsers,
    getUsersPage,
    getUserById,
    getUserByEmail,
    updateUser, 
    getUserByUsername
};