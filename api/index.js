'use strict'
let config = require('./config/config');
let mongoose = require('mongoose');
let app = require('./app');
let PORT = process.env.PORT || 3003;

mongoose.connect(config.DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("\n\n**** Conection with DB established ****\n");
        
        app.listen(PORT,()=>{
            console.log("**** Local Server created in http://127.0.0.1:" + PORT + "****\n")
        });
    })
    .catch(err => console.log(err));