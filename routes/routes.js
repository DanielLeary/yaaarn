var models  = require('../models');
var express = require('express');
var router = express.Router();
var colors = require('colors');

var offlineDb = require('../models2/offlineDb')

offlineDb.loginError = false;
offlineDb.loggedIn = false;



/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.user) {
		console.log("req.user.username is ".green +req.user.username);
		offlineDb.username = req.user.username;
	}
	else {
		offlineDb.username = null;

	}
	offlineDb.loggedIn = req.isAuthenticated();
	offlineDb.navLogin = false;
  res.render('index', offlineDb);
});

router.get('/stories', function(req, res, next) {
	if (req.user) {
		console.log("req.user.username is ".green +req.user.username);
		offlineDb.username = req.user.username;
	}
	else {
		offlineDb.username = null;

	}
	offlineDb.loggedIn = req.isAuthenticated();
	offlineDb.navLogin = false;
  res.render('index', offlineDb);
});



router.get('/login-signup', function(req, res, next) {
	//gives us the error message from the LocalStrategy
	var theError = req.flash('error')[0];
	if(theError){
		console.log(theError.red)
		offlineDb.loginError = true;
		offlineDb.theLoginError = theError;
	}
	else {
		offlineDb.loginError = false;
	}
	offlineDb.navLogin = true;
	res.render('loginSignup', offlineDb);
});


router.get('/post', function(req, res, next) {
	if (!req.isAuthenticated())
		res.redirect('/login-signup');	
	res.render('post', offlineDb);
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

