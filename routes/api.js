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

/* OLD version for single sentence comments
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
	}).then(function(comment) {
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
*/

router.post('/submit-comment', function(req, res, next) {
	if (!req.isAuthenticated())
		res.send('login-signup');

	models.Comment.create({ 
		text: req.body.commentText,
	    date: new Date(),
	    authorName: req.user.username,
	    authorLink: '/user/' + req.user.username,
	    sentenceId: 0,
	    storyId: req.body.storyId,
	    parentId: 0
	}).then(function(comment) {
		
		var sentencesSelected = JSON.parse(req.body.theSentences);
		
		// Prepare array of values for bulk create
		var commentSentencesList = [];
		for (var i=0; i<sentencesSelected.length; ++i){
				commentSentencesList.push({
					sentenceId: sentencesSelected[i],
					storyId: req.body.storyId,
					CommentId: comment.id
				});
		}
		
		// DO bulk create
		models.CommentSentence.bulkCreate(commentSentencesList
		).then(function() {
		
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
	})
});

router.post('/submit-badge', function(req, res, next) {
	if (!req.isAuthenticated())
		res.send('login-signup');

	models.Badge.create({ 
	    date: new Date(),
	    authorName: req.user.username,
	    authorLink: '/user/' + req.user.username,
	    sentenceId: 0,
	    storyId: req.body.storyId,
	    badgeType: req.body.badgeType
	}).then(function(comment) {
		
		var sentencesSelected = JSON.parse(req.body.theSentences);
		
		// Prepare array of values for bulk create
		var badgeSentencesList = [];
		for (var i=0; i<sentencesSelected.length; ++i){
			badgeSentencesList.push({
				sentenceId: sentencesSelected[i],
				storyId: req.body.storyId,
				BadgeId: comment.id
			});
		}
		
		// DO bulk create
		models.BadgeSentence.bulkCreate(badgeSentencesList
		).then(function() {
		
			models.Story.findOne({
				where: {id: req.body.storyId}
			}).then(function(story){
				if (req.body.badgeType == 'funny')
					story.increment('funny');
				if (req.body.badgeType == 'happy')
					story.increment('happy');
				if (req.body.badgeType == 'sad')
					story.increment('sad');
				if (req.body.badgeType == 'angry')
					story.increment('angry');
			});

	  		res.send('Badge added successfully');

		}).catch(function(error) {
    		// Ooops, do some error-handling
    		console.log(error);
  		})
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
