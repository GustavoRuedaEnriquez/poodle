'use strict'

const mongoose = require('mongoose');

let meetingSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    participants_number:{
        type: Number,
        required: true
    },
    participants:{
        type: Array,
        reuired: true
    },
    date:{
        type: Date,
        required: true
    },
    importance:{
        type: String,
        required: true
    },
    organizer:{
        type: Object,
        required: true
    },
    schedule_proposals:{
        type: Array,
        required: true
    }
});

module.exports = mongoose.model("Meeting", meetingSchema);
