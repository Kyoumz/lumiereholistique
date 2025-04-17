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
  video: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  podcast: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => console.log('VideosPodcast table has been created or exists.'))
  .catch((err) => console.error('Unable to create table:', err));

module.exports = VideosPodcast;
