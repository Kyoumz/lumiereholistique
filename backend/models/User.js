// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');  

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => console.log('User table has been created or exists.'))
  .catch((err) => console.error('Unable to create table:', err));

module.exports = User;
