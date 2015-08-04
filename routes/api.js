var models  = require('../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');


var localVars = require('../models2/offlineDb')


router.post('/signup', function(req, res, next) {

	models.User.create({ 
		username: req.body.username,
   		password: req.body.password,
    	email: req.body.email
	}).then(function(user) {
		console.log("Signup successful");
  		console.log(user.get({plain: true}));

        req.logIn(user, function (err) {
            if (!err){
            	res.redirect('/');
            } else {
                //handle error
            }
		})
    }).catch(function(error) {
    	// Ooops, do some error-handling
    	console.log(error);
  	})
});


router.post('/posturl', function(req, res, next) {

	
});

module.exports = router;
