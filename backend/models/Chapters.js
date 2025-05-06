const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Formation = require('./Formations');

const Chapter = sequelize.define('Chapter', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  video: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  formationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Formations',
      key: 'id'
    }
  }
});

module.exports = Chapter;
