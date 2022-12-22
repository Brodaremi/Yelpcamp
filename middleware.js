module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log("original url link" + req.originalUrl);
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must sign in first');
        return res.redirect('/login');
    } next();
}
