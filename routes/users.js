var express = require("express"),
    router = express.Router(),
    User = require('../models/user');

// Register
router.get("/register", function(req, res) {
    res.render("register");
});

// Login
router.get("/login", function(req, res) {
    res.render("login");
});

// Register User
router.post("/register", function(req, res) {
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
            errors:errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
    }

    User.createUser(newUser, function(err, user) {
        if (err) throw err;
        console.log(user);
    });

    req.flash('success_msg', 'You are registered and can now login');
    res.redirect('/users/login');
});

module.exports = router;
