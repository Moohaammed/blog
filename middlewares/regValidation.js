const express = require('express');
// const app = express();
const session = require('express-session');
const User = require('../models/User');

function errFormat(val, location, msg) {
    return {
        val: val,
        location: location,
        msg: msg
    }
}

module.exports = async function(req, res, next) {
    const {name, username, email, password, passwordc} = req.body;
    const validErrs = req.session.validationErrors = [];
    
    if (!name || name.length < 3) {
        validErrs.push(errFormat(name, 'name', 'name should contain at least 3 characters'))
    }
        
    if (!username || username.length < 3) {
        validErrs.push(errFormat(username, 'username', 'username shoud contain at least 3 characters'))
    }
    
    const usedUsername = await User.find({username: username})
    if (usedUsername.length) {
        console.log(usedUsername);
        validErrs.push(errFormat(username, 'username', 'username is used, please pick another one'))
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    const validEmail = validateEmail(email)
    if (!validEmail) {
        console.log(email)
        validErrs.push(errFormat(email, 'email', 'email is not valid'))
    }

    const usedEmail = await User.find({email: email})
    if (usedEmail.length) {
        console.log(usedEmail)
        validErrs.push(errFormat(email, 'email', 'email is used'))
    }

    if (!password || password.length < 5) {
        validErrs.push(errFormat(password, 'password', 'password should contain at least 5 characters'))
    }

    if (password !== passwordc) {
        validErrs.push(errFormat(password, 'password', 'password doesn\'t match'))
    }
    
    next()
}