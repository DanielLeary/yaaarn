var models  = require('../models');
var express = require('express');
var router = express.Router();
var colors = require('colors');
var request = require('request');
var readabilityKey = 'f59ad7b4b639497fa5aaf45b6d32fe6310094d7e';


var localVars = require('../models2/offlineDb')

localVars.loginError = false;
localVars.loggedIn = false;
localVars.sideEmph = 'popular';



//------------- Main routes -------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
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
    	limit: 100,
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
    	limit: 100,
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
    	limit: 100,
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
    	limit: 100,
    	// Newest first
    	order :[['points', 'DESC']] 
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
	console.log(colors.red('The slug in the router is: ' + slug));
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
    	res.render('postrender', localVars); 
    }).catch(function(error) {
    	console.log(error);
    })
});



router.post('/post-preview', function(req, res, next) {
	if (!req.isAuthenticated())
		res.redirect('/login-signup');

	var theUrl = req.body.url;
	var theRequest = 'http://readability.com/api/content/v1/parser?url=' + theUrl + '&token=' + readabilityKey;
	console.log(colors.green('The request URL is ' + theRequest));
	request(theRequest, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    // Get the JSON serialized from the readability API
	    var theJSON = JSON.parse(body);
	    console.log(theJSON.title.red);

	    localVars.theStory = theJSON;
	    res.render('postpreview', localVars);
	  }
	})

});


router.get('/createstory', function(req, res, next) {
	models.Story.create({
		url:'/',
		slugurl: '/',
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

