'use strict'

let Meeting = require('../models/meeting');

function addProposal(req, res){
    let meeting = new Meeting();
    let params = req.body;

    if(params.date == undefined){
        res.status(400).send({mesage:'Bad request error. The date field is missing'});
    }

    proposal.date = params.date;
    proposal.votes = (params.votes == undefined) ? 0 : params.votes;
    proposal.voters = (params.voters == undefined) ? [] : params.voters;

    proposal.save((err, storedProposal) => {
        if(err){
            res.status(500).send({mesage:'Server error.'});
        } else {
            if(!storedUser){
                res.status(404).send({message:'Error while saving.'});
            } else {
                res.status(201).send({message:'Proposal stored', proposal : storedProposal});
            }
        }
    });
}