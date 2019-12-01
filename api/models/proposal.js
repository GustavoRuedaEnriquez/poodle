'use strict'

const mongoose = require('mongoose');

let proposalSchema = mongoose.Schema({
    date:{
        type: Date,
        required: true,
    },
    votes:{
        type: Number,
        required: true,
    },
    voters:{
        type: Array,
        required:true
    }
});

module.exports = mongoose.model("Proposal", proposalSchema);
