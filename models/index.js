"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
//var env       = process.env.NODE_ENV || "development";
//var config    = require(__dirname + '/../config/config.json')[env];

// LOCAL DB SETUP
var DATABASE_URL = 'postgres://yaaarn:c260gDiFzcejw0iPFmXSoBrFUf@localhost:5432/yaaarndb';
var sequelize = new Sequelize(DATABASE_URL);

// HEROKU DB SETUP
//var sequelize = new Sequelize(process.env.DATABASE_URL, {dialectOptions: {ssl: true}});

var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;