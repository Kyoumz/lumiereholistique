const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Article = require('./Articles');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Article.hasMany(Comment, {
  foreignKey: 'articleId',
  onDelete: 'CASCADE',
});
Comment.belongsTo(Article, {
  foreignKey: 'articleId',
});

module.exports = Comment;
