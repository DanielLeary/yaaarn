"use strict";
var moment = require('moment');
moment().format();

module.exports = function(sequelize, DataTypes) {
  var Badge = sequelize.define("Badge", {
    date: DataTypes.DATE,
    authorName: DataTypes.TEXT,
    authorLink: DataTypes.TEXT,
    sentenceId: DataTypes.BIGINT,
    storyId: DataTypes.INTEGER,
    badgeType: DataTypes.TEXT
  }, {
    classMethods: {
      
      associate: function(models) {
        Badge.hasMany(models.BadgeSentence)
      }
    },

    instanceMethods: {
        humanDate: function() {
          return moment(this.date).fromNow();
        }
    }
  });

  return Badge;
};