'use strict'

const mongoose = require('mongoose');

let proposalSchema = mongoose.Schema({
    date:{
        type: Date,
        required: true,
    },
    votes:{
        type: Number,
        default: 0
    },
    voters:{
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("Proposal", proposalSchema);
