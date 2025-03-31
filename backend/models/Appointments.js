// models/Appointment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');  

const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
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