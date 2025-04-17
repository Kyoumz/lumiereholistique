const { DataTypes } = require('sequelize');
const sequelize = require('../db');  

const Directory = sequelize.define('Directory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => console.log('Directory table has been created or exists.'))
  .catch((err) => console.error('Unable to create table:', err));

module.exports = Directory;
