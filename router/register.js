const express = require('express');
const router = express.Router();
const validate = require('../middlewares/regValidation');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const session = require('express-session')

router.post('/register', validate, function(req, res) {
    const errs = req.session.validationErrors;
    if (errs.length > 0) {
      console.log(errs);
      return res.redirect('/')
    }
  
    let {name, username, email, password} = req.body;
    bcrypt.hash(password, 10, function(err, hashPassword) {
      const user = new User({
        name: name,
        username: username,
        email: email,
        password: hashPassword
      })
      user.save(function(err, user) {
        req.session.successSignup = 'success'
        res.redirect('/signin')
      })
    })
    
})
  
module.exports = router