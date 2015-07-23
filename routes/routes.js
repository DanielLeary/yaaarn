var models  = require('../models');
var express = require('express');
var router = express.Router();

var offlineDb = require('../models2/offlineDb')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', offlineDb);
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

