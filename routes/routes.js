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
	localVars.navLogin = false;
	localVars.sideEmph = 'popular';

	models.Story.findAll({ 
    	limit: 50,
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
	localVars.navLogin = false;
	localVars.sideEmph = 'popular';

	models.Story.findAll({ 
    	limit: 50,
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
	localVars.navLogin = false;
	localVars.sideEmph = 'recent';

	models.Story.findAll({ 
    	limit: 50,
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
	localVars.navLogin = false;
	localVars.sideEmph = 'popular';

	models.Story.findAll({ 
    	limit: 50,
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
	localVars.navLogin = true;
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
    	res.render('postrender', localVars); 
    }).catch(function(error) {
    	console.log(error);
    })
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



module.exports = router;

