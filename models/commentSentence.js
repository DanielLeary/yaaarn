"use strict";
var moment = require('moment');
moment().format();

module.exports = function(sequelize, DataTypes) {
  var CommentSentence = sequelize.define("CommentSentence", {
    sentenceId: DataTypes.BIGINT,
  }, {
    classMethods: {
      associate: function(models) {
        CommentSentence.belongsTo(models.Comment, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    },

    instanceMethods: {
        humanDate: function() {
          return moment(this.date).fromNow();
        }
    }
  });

  return CommentSentence;
};