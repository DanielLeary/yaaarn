var express = require('express');
var router = express.Router();

var offlineDb = require('../models/offlineDb')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', offlineDb);
});

module.exports = router;
