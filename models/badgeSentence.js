"use strict";
var moment = require('moment');
moment().format();

module.exports = function(sequelize, DataTypes) {
  var BadgeSentence = sequelize.define("BadgeSentence", {
    sentenceId: DataTypes.BIGINT,
    storyId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        BadgeSentence.belongsTo(models.Badge, {
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

  return BadgeSentence;
};