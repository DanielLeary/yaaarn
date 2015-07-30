var models  = require('../models');
var express = require('express');
var router = express.Router();
var colors = require('colors');

var offlineDb = require('../models2/offlineDb')

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.user) {
		console.log("req.user.username is ".green +req.user.username);
	}
  res.render('index', offlineDb);
});

router.get('/login-signup', function(req, res, next) {
	//gives us the error message from the LocalStartegy
	var theError = req.flash('error')[0];
	if(theError){console.log(theError.red)}
	res.render('loginSignup', offlineDb);
});


router.get('/createstory', function(req, res, next) {
	models.Story.create({ 
		url:'/', 
		title:'How a Tokyo bookstore made me fall back in love with print.', 
		text:'More test',
		points:90, 
		comments:21, 
		commentUrl:'/',
		date: new Date(),
		authorName: 'Jenny Cross',
		authorLink: '/',
		happy: 3,
		funny:6,
		sad: 0,
		angry: 0
	}).then(function(story) {
  		console.log('Logging item: ' + story.get({plain: true}))
	})
});


module.exports = router;

