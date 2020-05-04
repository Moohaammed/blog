const User = require('../models/User');
module.exports.declareUser = async function(req, res, next) {
    if (req.session.userSession) {
        res.locals.loggedIn = true;
        res.locals.userId = req.session.userSession;
        let users = await User.find()
        let creators = [];
        users.forEach(user => {
            creators.push(user.username)
        })
        res.locals.creators = creators;
        return next();
    }
    next();
}

module.exports.checkUser = function(req, res, next) {
    if (!req.session.userSession) {
        return res.redirect('/signin')
    }
    next()
}