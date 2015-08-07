"use strict";
var moment = require('moment');
moment().format();

module.exports = function(sequelize, DataTypes) {
  var Story = sequelize.define("Story", {
    url: DataTypes.TEXT,
    slugurl: DataTypes.TEXT,
    title: DataTypes.TEXT,
    text: DataTypes.TEXT,
    points: DataTypes.INTEGER,
    comments: DataTypes.INTEGER,
    commentUrl: DataTypes.TEXT,
    date: DataTypes.DATE,
    authorName: DataTypes.TEXT,
    authorLink: DataTypes.TEXT,
    happy: DataTypes.INTEGER,
    funny: DataTypes.INTEGER,
    sad: DataTypes.INTEGER,
    angry: DataTypes.INTEGER
  }, {
    classMethods: {
      /*
      associate: function(models) {
        User.hasMany(models.Task)
      }
      */
    },

    instanceMethods: {
        humanDate: function() {
        return moment(this.date).fromNow();
      }
    }
  });

  return Story;
};