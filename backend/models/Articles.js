const { DataTypes } = require('sequelize');
const sequelize = require('../db');  

const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  });

sequelize.sync()
  .then(() => console.log('Article table has been created or exists.'))
  .catch((err) => console.error('Unable to create table:', err));

module.exports = Article;
