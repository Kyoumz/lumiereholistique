// models/Appointment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');  

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
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
  link: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
  });

  sequelize.sync()
  .then(() => console.log('Appointment table has been created or exists.'))
  .catch((err) => console.error('Unable to create table:', err));
  


  module.exports = Appointment;