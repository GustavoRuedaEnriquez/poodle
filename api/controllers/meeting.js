'use strict'

let Meeting = require('../models/meeting');

function addMeeting(req, res){
    let meeting = new Meeting();
    let params = req.body;

    if(params.name == undefined){
        res.status(400).send({mesage:'Bad request error. The name field is missing'});
    }
    if(params.description == undefined){
        res.status(400).send({mesage:'Bad request error. The description field is missing'});
    }
    if(params.importance == undefined){
        res.status(400).send({mesage:'Bad request error. The importance field is missing'});
    }
    if(params.organizer == undefined){
        res.status(400).send({mesage:'Bad request error. The organizer field is missing'});
    }

    meeting.name = params.name;
    meeting.description = params.description;
    meeting.participants_number = (params.participants_number == undefined) ? 0 : params.participants_number;
    meeting.participants = (params.participants == undefined) ? [] : params.participants;
    meeting.date = params.date;
    meeting.importance = params.importance;
    meeting.organizer = params.organizer;
    meeting.schedule_proposal = (params.schedule_proposal == undefined) ? [] : params.schedule_proposal;

    meeting.save((err, storedMeeting) => {
        if(err){
            res.status(500).send({mesage:'Server error.'});
        } else {
            if(!storedUser){
                res.status(404).send({message:'Error while saving.'});
            } else {
                res.status(201).send({message:'Meeting stored', meeting : storedMeeting});
            }
        }
    });   
}

function getMeetings(req,res){
    Meeting.find({},(err, meetings) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(proposals).length === 0){
                res.status(404).send({message: 'No meetings found.'});
            }else{
                res.status(200).send({message:'Meetings obtained', results : meetings});
            }
        }
    });
}

function getMeetingById(req,res){
    let meetingId = req.params.id;
    Meeting.findById(meetingId,(err,proposal) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(proposal).length === 0){
                res.status(404).send({message: 'Meeting not found.'});
            }else{
                res.status(200).send({message:'Meeting obtained', result : proposal});
            }
        }
    });
}

module.exports = {
    addMeeting,
    getMeetings,
    getMeetingById
}