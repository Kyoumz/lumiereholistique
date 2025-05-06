const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const VideosPodcast = sequelize.define('VideosPodcast', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  themes: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

sequelize.sync()
  .then(() => console.log('VideosPodcast table has been created or exists.'))
  .catch((err) => console.error('Unable to create table:', err));

module.exports = VideosPodcast;
