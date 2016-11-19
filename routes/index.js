var express = require('express'),
    router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
    res.render('index');
});

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('success_msg', 'Sign in or create an account.');
        res.redirect('/users/login');
    }
}

module.exports = router;