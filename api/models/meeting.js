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
        type: Array,
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
        type: Number,
        required: true
    },
    organizer:{
        type: Mixed,
        reuired: true
    },
    schedule_proposals:{
        type: Array,
        reuired: true
    }
});

module.exports = mongoose.model("Meeting", meetingSchema);
