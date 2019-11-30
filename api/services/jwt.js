'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta';

exports.createToken = function(user){
    let payload = {
        sub: user._id,
        username: user.username,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(1,'days').unix()
    };
    return jwt.encode(payload,secret);
}