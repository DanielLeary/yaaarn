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
    parentId: DataTypes.INTEGER
  }, {
    classMethods: {
      
      associate: function(models) {
        Comment.hasMany(models.CommentSentence);
        Comment.belongsTo(models.Story);
      }
    },

    instanceMethods: {
        humanDate: function() {
          return moment(this.date).fromNow();
        }
    }
  });

  return Comment;
};