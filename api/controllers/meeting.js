'use strict'

let Meeting = require('../models/meeting');
let Proposal = require('../models/proposal');

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
    meeting.schedule_proposals = (params.schedule_proposals == undefined) ? [] : params.schedule_proposals;

    meeting.save((err, storedMeeting) => {
        if(err){
            res.status(500).send({mesage:'Server error.'});
            console.log(err)
        } else {
            if(!storedMeeting){
                res.status(404).send({message:'Error while saving.'});
            } else {
                res.status(201).send({message:'Meeting stored', meeting : storedMeeting});
            }
        }
    });   
}

function getMeetings(req,res){
    Meeting.find({}).lean(true).exec((err, meetings) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(meetings).length === 0){
                res.status(404).send({message: 'No meetings found.'});
            }else{
                let temp = meetings; 
                let len = meetings.length;
                if(req.query.page != undefined){
                    let page = req.query.page;
                    let limit = 5;
                    if(req.query.limit != undefined){
                        limit = req.query.limit;
                    }
                    let start = ((limit*page) - (limit-1)) - 1;
                    let end = (limit * page) - 1;
                    temp = temp.filter((item, i) => {return i >= start &&  i <= end;});
                }
                res.status(200).send({message:'Meetings obtained', lengthRes: len, results : temp});
            }
        }
    });
}

function getMeetingsByUserId(req,res){
    Meeting.find({},(err, meetings) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(meetings).length === 0){
                res.status(404).send({message: 'No meetings found.'});
            }else{
                let temp = meetings; 
                let len = meetings.length;

                if(req.query.page != undefined){
                    let page = req.query.page;
                    let limit = 5;
                    if(req.query.limit != undefined){
                        limit = req.query.limit;
                    }
                    let start = ((limit*page) - (limit-1)) - 1;
                    let end = (limit * page) - 1;
                    temp = temp.filter((item, i) => {return i >= start &&  i <= end;});
                }
                res.status(200).send({message:'Meetings obtained', lengthRes: len ,results : temp});
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

function updateMeetingById(req,res){
    let meetingId = req.params.id;
    Meeting.findOneAndUpdate({_id: meetingId}, req.body, {new:true},(err,proposal) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(proposal).length === 0){
                res.status(404).send({message: 'Meeting not found.'});
            } else {
                res.status(200).send({message:'Meeting obtained', result : proposal});
            }
        }
    });
}

function getMeetingsByUser(req,res){
    let email = req.params.email;
    Meeting.find({$or:[{'participants.email':{$eq:email}},{'organizer.email':{$eq:email}}]}).lean(true).exec((err, meetings) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(meetings).length === 0){
                res.status(404).send({message: 'User has no meetings.'});
            }else{
                for(let i in meetings) {
                    if(meetings[i].organizer.email == email) {
                        meetings[i].role = "Organizer";
                    } else {
                        meetings[i].role = "Participant";
                    }
                }
                let temp = meetings;
                let len = meetings.length;

                if(req.query.page != undefined){
                    let page = req.query.page;
                    let limit = 5;
                    if(req.query.limit != undefined){
                        limit = req.query.limit;
                    }
                    let start = ((limit*page) - (limit-1)) - 1;
                    let end = (limit * page) - 1;
                    temp = temp.filter((item, i) => {return i >= start &&  i <= end;});
                }
                res.status(200).send({message:'Meetings obtained', lengthRes: len, results : temp});
            }
        }
    });
}

function getMeetingsByMonthAndUser(req,res){
    let month = req.params.month;
    let email = req.body.email;
    Meeting.find({$or:[{'participants.email':{$eq:email}},{'organizer.email':{$eq:email}}]}).lean(true).exec((err, meetings) => {
        if(err){
            console.log(err);
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(meetings).length === 0){
                res.status(404).send({message: 'User has no meetings.'});
            } else {
                let monthMeetings = meetings.filter((item) => {return item.date != null});
                let final = monthMeetings.filter((item) => {
                    let date = new Date(item.date);
                    return date.getMonth() ==  month;
                });
                if(Object.entries(final).length === 0){
                    res.status(404).send({message:'No meetings in this month.'});
                } else {
                    let temp = final;
                    let len = meetings.length;

                    if(req.query.page != undefined){
                        let page = req.query.page;
                        let limit = 5;
                        if(req.query.limit != undefined){
                            limit = req.query.limit;
                        }
                        let start = ((limit*page) - (limit-1)) - 1;
                        let end = (limit * page) - 1;
                        temp = temp.filter((item, i) => {return i >= start &&  i <= end;});
                    }
                    
                res.status(200).send({message:'Meetings obtained', lengthRes: len , results : temp});
                }
            }
        }
    });
}


module.exports = {
    addMeeting,
    getMeetings,
    getMeetingById,
    updateMeetingById,
    getMeetingsByUser,
    getMeetingsByMonthAndUser
}