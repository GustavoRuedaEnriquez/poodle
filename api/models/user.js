'use strict'

const mongoose = require('mongoose');

let usersSchema = mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    nombre:{
        type: String,
        require:true
    },
    apellido:{
        type: String,
        require:true
        
    },
    date:{
        type: Date,
        required: true
    },
    position:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: false
    },
    actual:{
        type: Number,
        required: false,
        default: 0
    },
    pending:{
        type: Number,
        required: false,
        default: 0
    },
    assisted:{
        type: Number,
        required: false,
        default: 0
    },
    password:{
        type: String,
        required: true
    },
    feedback:{
        type: Array,
        required: false,
        default: {}
    }
})

module.exports = mongoose.model("User", usersSchema);