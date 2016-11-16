var express = require('express'),
    router = express.Router();

// Get Homepage
router.get('/', function(req, res) {
    res.render('index');
});

module.exports = router;