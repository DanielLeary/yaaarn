var models  = require('../models');
var express = require('express');
var router = express.Router();
var colors = require('colors');
var request = require('request');
var readabilityKey = 'f59ad7b4b639497fa5aaf45b6d32fe6310094d7e';
var cheerio = require('cheerio');
var moment = require('moment');
moment().format();
var helpers = require('../helpers/helpers');

var localVars = require('../models2/offlineDb');

localVars.loginError = false;
localVars.loggedIn = false;
localVars.sideEmph = 'popular';
localVars.pageNum = 1;



//------------- Main routes -------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.user) {
		localVars.username = req.user.username;
	}
	else {
		localVars.username = null;
	}
	localVars.loggedIn = req.isAuthenticated();
	localVars.topEmph = 'stories';
	localVars.sideEmph = 'popular';
	localVars.pageNum = 1;

	models.Story.findAll({ 
    	limit: 20,
    	// Newest first
    	order :[['points', 'DESC'],['date','DESC']] 
    }).then(function(stories) {
    	localVars.stories = stories;
    	res.render('index', localVars); 
    }).catch(function(error) {
    	console.log(error);
    })
	//res.render('index', localVars);
});

router.get('/stories', function(req, res, next) {
	if (req.user) {
		console.log("req.user.username is ".green +req.user.username);
		localVars.username = req.user.username;
	}
	else {
		localVars.username = null;
	}
	localVars.loggedIn = req.isAuthenticated();
	localVars.topEmph = 'stories';
	localVars.sideEmph = 'popular';
	localVars.pageNum = 1;

	models.Story.findAll({ 
    	limit: 20,
    	// Newest first
    	order :[['points', 'DESC'],['date','DESC']] 
    }).then(function(stories) {
    	localVars.stories = stories;
    	res.render('index', localVars); 
    }).catch(function(error) {
    	console.log(error);
    })
	//res.render('index', localVars);
});

router.get('/stories/recent', function(req, res, next) {
	if (req.user) {
		console.log("req.user.username is ".green +req.user.username);
		localVars.username = req.user.username;
	}
	else {
		localVars.username = null;
	}
	localVars.loggedIn = req.isAuthenticated();
	localVars.topEmph = 'stories';
	localVars.sideEmph = 'recent';
	localVars.pageNum = 1;


	models.Story.findAll({ 
    	limit: 20,
    	// Newest first
    	order :[['date', 'DESC']] 
    }).then(function(stories) {
    	localVars.stories = stories;
    	res.render('index', localVars); 
    }).catch(function(error) {
    	console.log(error);
    })
	//res.render('index', localVars);
});

router.get('/stories/popular', function(req, res, next) {
	if (req.user) {
		console.log("req.user.username is ".green +req.user.username);
		localVars.username = req.user.username;
	}
	else {
		localVars.username = null;
	}
	localVars.loggedIn = req.isAuthenticated();
	localVars.topEmph = 'stories';
	localVars.sideEmph = 'popular';
	localVars.pageNum = 1;
	console.log(('break').red);
	console.log(localVars.pageNum);

	models.Story.findAll({ 
    	limit: 20,
    	// Newest first
    	order :[['points', 'DESC'],['date','DESC']] 
    }).then(function(stories) {
    	localVars.stories = stories;
    	res.render('index', localVars); 
    }).catch(function(error) {
    	console.log(error);
    })
	//res.render('index', localVars);
});

router.param('page', function (req, res, next, page) {
  req.page = new Number(page);

  next();
})


router.get('/stories/popular/:page', function(req, res, next) {
	if (req.user) {
		console.log("req.user.username is ".green +req.user.username);
		localVars.username = req.user.username;
	}
	else {
		localVars.username = null;
	}
	localVars.loggedIn = req.isAuthenticated();
	localVars.topEmph = 'stories';
	localVars.sideEmph = 'popular';

	var page = req.page;
	req.page = 1;
	localVars.pageNum = page;

	if(page<2){
		localVars.pageNum = 1;
		res.redirect('/stories/popular')
	}

	var perPage = 20;
	var theLimit = page*perPage;
	var theOffset = ((page-1)*perPage)+1;

	models.Story.findAll({ 
    	limit: theLimit,
    	offset: theOffset,
    	// Newest first
    	order :[['points', 'DESC'],['date','DESC']] 
    }).then(function(stories) {
    	localVars.stories = stories;
    	res.render('index', localVars); 
    }).catch(function(error) {
    	console.log(error);
    })
});

router.get('/stories/recent/:page', function(req, res, next) {
	if (req.user) {
		console.log("req.user.username is ".green +req.user.username);
		localVars.username = req.user.username;
	}
	else {
		localVars.username = null;
	}
	localVars.loggedIn = req.isAuthenticated();
	localVars.topEmph = 'stories';
	localVars.sideEmph = 'recent';

	var page = req.page;
	req.page = 1;
	localVars.pageNum = page;

	if(page<2){
		localVars.pageNum = 1;
		res.redirect('/stories/recent')
	}

	var perPage = 20;
	var theLimit = page*perPage;
	var theOffset = ((page-1)*perPage)+1;

	models.Story.findAll({ 
    	limit: theLimit,
    	offset: theOffset,
    	// Newest first
    	order :[['date', 'DESC']] 
    }).then(function(stories) {
    	localVars.stories = stories;
    	res.render('index', localVars); 
    }).catch(function(error) {
    	console.log(error);
    })
	//res.render('i
});

//- END Main routes --------------------------------------------


router.get('/login-signup', function(req, res, next) {
	//gives us the error message from the LocalStrategy
	var theError = req.flash('error')[0];
	if(theError){
		console.log(theError.red)
		localVars.loginError = true;
		localVars.theLoginError = theError;
	}
	else {
		localVars.loginError = false;
	}
	localVars.topEmph = 'login';
	res.render('loginSignup', localVars);
});


router.get('/postlink', function(req, res, next) {
	if (!req.isAuthenticated())
		res.redirect('/login-signup');	
	res.render('postlink', localVars);
});


router.param('storyslug', function (req, res, next, slug) {
  req.slug = slug;
  next();
})


router.get('/post/:storyslug', function(req, res, next) {
	var slug = req.slug;
	localVars.topEmph = 'stories';

	if (req.user) {
		localVars.username = req.user.username;
	}
	else {
		localVars.username = null;
	}
  	models.Story.findOne({ 
    	where: {slugurl: slug} 
    }).then(function(story) {
    	if (!story) {
		    //no story;
		    res.status(404);
		    res.render('error', {
			    message: '404 - Not Found',
			    error: {}
			});
    	}
    	localVars.theStory = story;
    	localVars.sideEmph = 'none';

    	// Get comments on this by user
    	models.Comment.findAll({
		  where: {
		    StoryId: story.id
		  }
		}).then(function(comments){
			localVars.allComments = [];
			if(comments.length>0){
				localVars.allComments = comments;
			}
			// get sentences for those comments
			models.CommentSentence.findAll({
				where: {
					storyId: story.id
				}
			}).then(function(commentSentenceList){
				localVars.sentenceComments = [];
				if(commentSentenceList.length>0){
					localVars.sentenceComments = commentSentenceList;
				}

				//Get all badges for user
				models.Badge.findAll({
					where: {
						StoryId: story.id
					}
				}).then(function(badges){
					localVars.allBadges = [];
					if (badges.length>0){
						localVars.allBadges = badges;
					}
					//Get sentences for those badges
					models.BadgeSentence.findAll({
						where: {
							storyId: story.id
						}
					}).then(function(badgeSentenceList){
						localVars.sentenceBadges = [];
						if(badgeSentenceList.length>0){
							localVars.sentenceBadges = badgeSentenceList;
						}
						res.render('postrender', localVars); 
					})
				})
			})

		}).catch(function(error) {
    		console.log(error);
    	});

    }).catch(function(error) {
    	console.log(error);
    });
});

router.post('/post-preview', function(req, res, next) {
	if (!req.isAuthenticated())
		res.redirect('/login-signup');

	// Add in URL validation

	var theUrl = req.body.url;
	var theRequest = 'http://readability.com/api/content/v1/parser?url=' + theUrl + '&token=' + readabilityKey;
	console.log(colors.green('The request URL is ' + theRequest));
	request(theRequest, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    // Get the JSON serialized from the readability API
	    var theJSON = JSON.parse(body);
	    console.log(theJSON.title.red);

	    localVars.theStory = theJSON;

	    // Add style tags with cheerio
	    var theHtml = theJSON.content;
	    theHtml = helpers.addStoryTags(theHtml);
	    localVars.theStory.content = theHtml;
	    
	    res.render('postpreview', localVars);
	  }
	  else {
	  	res.render('error', {
			    message: 'Error retrieving link',
			    error: {}
			});
	  }
	})

});


router.param('theUser', function (req, res, next, theUser) {
  req.theUser = theUser;
  next();
})


router.get('/user/:theUser', function(req, res, next) {
	if (req.user) {
		localVars.username = req.user.username;
	}
	else {
		localVars.username = null;
	}
    localVars.loggedIn = req.isAuthenticated();
	localVars.topEmph = 'profile';
    localVars.sideEmph = 'none';
    localVars.theUser = req.theUser;
    
    models.Comment.findAll({
    	where: {
    		authorName: req.theUser
    	},
    	include: [models.Story]
    }).then(function(comments){
    	//console.log(JSON.stringify(comments[0].text).green);
    	//console.log(JSON.stringify(comments[0].Story.title).green);
    	helpers.addTypeToModel(comments,'comment');
    	localVars.usersComments = comments;
    	
    	models.Badge.findAll({
    		where: {
    			authorName: req.theUser
    		},
    		include: [models.Story]
    	}).then(function(badges){
    		helpers.addTypeToModel(badges,'badge');
    		localVars.usersBadges = badges;

			models.Story.findAll({
	    		where: {
	    			authorName: req.theUser
	    		}
	    	}).then(function(stories){
	    		helpers.addTypeToModel(stories,'story');
	    		localVars.usersStories = stories;

	    		localVars.usersContent = stories.concat(badges).concat(comments);
	    		localVars.usersContent.sort(function(a,b){
	    			if(a.date > b.date)
	    				return -1;
	    			if(a.date < b.date)
	    				return 1;
	    			else
	    				return 0;
	    		});

    			res.render('profile', localVars);
    		})
    	})

    })

});


module.exports = router;



