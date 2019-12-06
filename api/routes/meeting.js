'use strict'

const express = require('express');
const MeetingController = require('../controllers/meeting');
const mdAuth = require('../middlewares/authenticate');

let api = express.Router();

api.post('/meeting',mdAuth.ensureAuth,MeetingController.addMeeting);
api.get('/meetings',MeetingController.getMeetings);
api.get('/meeting/:id',mdAuth.ensureAuth,MeetingController.getMeetingById);
api.get('/meetings/user/:email',mdAuth.ensureAuth,MeetingController.getMeetingsByUser);
api.get('/meetings/month/:month',mdAuth.ensureAuth,MeetingController.getMeetingsByMonthAndUser);
api.put('/meeting/:id',MeetingController.updateMeetingById);

module.exports = api;