'use strict'

let Proposal = require('../models/proposal');

function addProposal(req, res){
    let proposal = new Proposal();
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

function getProposals(req, res){
    Proposal.find({},(err, proposals) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(proposals).length === 0){
                res.status(404).send({message: 'No proposals found.'});
            }else{
                res.status(200).send({message:'Proposals obtained', results : proposals});
            }
        }
    });
}

function getProposalById(req,res){
    let proposalId = req.params.id;
    Proposal.findById(proposalId,(err,proposal) => {
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(Object.entries(proposal).length === 0){
                res.status(404).send({message: 'Proposal not found.'});
            }else{
                res.status(200).send({message:'Proposal obtained', result : proposal});
            }
        }
    });
}

function updateProposal(req, res){
    let id = req.params.id;
    let update = req.body;
    Proposal.findByIdAndUpdate(id, update, {new:true}, (err,updatedProposal) =>{
        if(err){
            res.status(500).send({message: 'Server error.'});
        }else{
            if(!updatedProposal){
                res.status(404).send({message: 'Could not update the proposal.'});
            }else{
                res.status(200).send({message:'Proposal updated', result : updatedProposal})
            }
        }
    });
}

module.exports = {
    addProposal,
    getProposals,
    getProposalById,
    updateProposal
};