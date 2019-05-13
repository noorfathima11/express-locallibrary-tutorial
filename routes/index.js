var express = require('express');
var router = express.Router();

// GET home page. Initial
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GEEKSKOOL Mini Library' });
});


// GET Home page
router.get('/', function(req, res) {
  res.redirect('/catalog')
})

module.exports = router;
