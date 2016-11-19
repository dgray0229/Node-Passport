var express = require("express"),
    router = express.Router(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/user');

// Register
router.get("/register", function (req, res) {
    res.render("register");
});

// Login
router.get("/login", function (req, res) {
    res.render("login");
});

// Register User
router.post("/register", function (req, res) {
    var name = req.body.name,
        email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        password2 = req.body.password2;

    // Validation
    req.checkBody("name", "Name is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();
    req.checkBody("email", "Email is not valid").isEmail();
    req.checkBody("username", "Username is required").notEmpty();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("password2", "Passwords do not match").equals(req.body.password);


    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
    }

    User.createUser(newUser, function (err, user) {
        if (err) throw err;
        console.log(user);
    });

    req.flash('success_msg', 'You are registered and can now login');
    res.redirect('/users/login');
});


passport.use(new LocalStrategy(
    function(username, password, done) {

        User.getUserByUsername(username, function(err, user) {
            if(err) throw err;
            if(!user) {
                return done(null, false, {message: "Unknown User"});
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if(err) throw err;
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: "Invalid password"});
                }
            })
        });

    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate("local", {successRedirect: '/', failureRedirect: "/users/login", failureFlash: true}),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // req.user contains the authenticated user.
        res.redirect("/" + req.user.username);
    }
);

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
