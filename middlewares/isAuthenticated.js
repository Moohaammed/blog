module.exports.declareUser = function(req, res, next) {
    if (req.session.userSession) {
        res.locals.loggedIn = req.session.userSession
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