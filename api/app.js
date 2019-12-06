'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();


app.use(cors())

//cargar rutas
let userRoutes = require('./routes/user');
let meetingRoutes = require('./routes/meeting');

//middleware de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/../public"))
app.use(express.static(__dirname + "/../public/views"))



//Rutas Base
app.use('/api',userRoutes);
app.use('/api',meetingRoutes);

module.exports = app;