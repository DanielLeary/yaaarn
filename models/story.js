"use strict";

module.exports = function(sequelize, DataTypes) {
  var Story = sequelize.define("Story", {
    url: DataTypes.TEXT,
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
    }
  });

  return Story;
};