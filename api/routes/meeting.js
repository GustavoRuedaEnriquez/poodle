'use strict'

const express = require('express');
const MeetingController = require('../controllers/meeting');

let api = express.Router();

api.post('/meeting',MeetingController.addMeeting);
api.get('/meetings',MeetingController.getMeetings);
api.get('/meeting/:id',MeetingController.getMeetingById);
api.get('/meetings/user/:email',MeetingController.getMeetingsByUser);
api.get('/meetings/month/:month',MeetingController.getMeetingsByMonthAndUser);
api.put('/meeting/:id',MeetingController.updateMeetingById);

module.exports = api;