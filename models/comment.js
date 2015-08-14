"use strict";
var moment = require('moment');
moment().format();

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    text: DataTypes.TEXT,
    date: DataTypes.DATE,
    authorName: DataTypes.TEXT,
    authorLink: DataTypes.TEXT,
    sentenceId: DataTypes.BIGINT,
    storyId: DataTypes.INTEGER,
    parentId: DataTypes.INTEGER
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

  return Comment;
};