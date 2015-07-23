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
		title:'Hiking the Appalachian trail: How I quit my consulting job and never looked back.', 
		text:'Test',
		points:12, 
		comments:24, 
		commentUrl:'/',
		date: new Date(),
		authorName: 'Chris Stewart',
		authorLink: '/',
		happy: 10,
		funny: 12,
		sad: 0,
		angry: 8 
	}).then(function(story) {
  		console.log('Logging item: ' + story.get({plain: true}))
	})
});


module.exports = router;

