const express = require('express');
const router = express.Router();
const User = require('../models/User');
const session = require('express-session');
const bcrypt = require('bcrypt');

router.post('/signin', function(req, res) {
    const {email, password} = req.body;

    if (!email || !password) {
        req.session.signinErrs = 'email/password is not valid';
        return res.redirect('/signin');
    }

    User.findOne({email: email})
        .exec((err, user) => {
            if (err) {
                return console.error(err);
            }

            if (!user) {
                req.session.signinErrs = ' invalid email or password'
                return res.redirect('/signin')
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return console.error(err);
                    
                }

                if (!result) {
                    req.session.signinErrs = 'invalid email or password!';
                    return res.redirect('/signin')
                }

                req.session.userSession = user._id
                res.redirect('/profile/user-'+user._id);
            })            
        })

})

module.exports = router;