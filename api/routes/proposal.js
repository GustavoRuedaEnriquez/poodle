'use strict'

const express = require('express');
const ProposalController = require('../controllers/proposal');

let api = express.Router();

api.post('/proposal',ProposalController.addProposal);
api.get('/proposals',ProposalController.getProposals);
api.get('/proposal/:id',ProposalController.getProposalById);
api.patch('/proposal/:id',ProposalController.updateProposal);

module.exports = api;