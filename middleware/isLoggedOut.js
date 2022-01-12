module.exports = (req, res, next) => {
    // if an already logged in user tries to access the 
    // login page it redirects them to the home page
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};
