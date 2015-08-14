var models  = require('../models');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');
var readabilityKey = 'f59ad7b4b639497fa5aaf45b6d32fe6310094d7e';
var colors = require('colors');
var helpers = require('../helpers/helpers');

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

router.post('/submit-draft-link', function(req, res, next) {
	if (!req.isAuthenticated())
		res.send('login-signup');

	// Need to add script tag sanitization to this 

	// Add style tags with cheerio
	var theHtml = req.body.theText;
	theHtml = helpers.addStoryTags(theHtml);
	var theText = theHtml;

	var theTitle = req.body.theTitle;
	var theUrl = req.body.theUrl;
	//var theText = req.body.theText;
	var slugUrl = convertToSlug(theTitle);
	var randomNum = Math.floor(Math.random() * 1000000000) + 1000000000;
	slugUrl = slugUrl + '-' + randomNum;

	//theCommentUrl = slugUrl + '/comments';
	//theAuthorLink = '/user/' + req.user.username;
	models.Story.create({ 
		url:theUrl,
		slugurl: slugUrl,
		title: theTitle, 
		text: theText,
		points:0, 
		comments:0, 
		commentUrl: slugUrl + '/comments',
		date: new Date(),
		authorName: req.user.username,
		authorLink: '/user/' + req.user.username,
		happy: 0,
		funny:0,
		sad: 0,
		angry: 0
	}).then(function(story) {
  		res.send('post/' + slugUrl);
	}).catch(function(error) {
    	// Ooops, do some error-handling
    	console.log(error);
  	})

});


router.post('/submit-comment', function(req, res, next) {
	if (!req.isAuthenticated())
		res.send('login-signup');

	models.Comment.create({ 
		text: req.body.commentText,
	    date: new Date(),
	    authorName: req.user.username,
	    authorLink: '/user/' + req.user.username,
	    sentenceId: req.body.sentenceId,
	    storyId: req.body.storyId,
	    parentId: 0
	}).then(function(story) {
		models.Story.findOne({
			where: {id: req.body.storyId}
		}).then(function(story){
			story.increment('comments');
		});
  		res.send('Comment added successfully');
	}).catch(function(error) {
    	// Ooops, do some error-handling
    	console.log(error);
  	})

});




/*------------------ Helpers -------------------*/
function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}





module.exports = router;
