const { DataTypes } = require('sequelize');
const sequelize = require('../db');  

const Formation = sequelize.define('Formation', {
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  sequelize.sync()
  .then(() => console.log('Formation table has been created or exists.'))
  .catch((err) => console.error('Unable to create table:', err));
  
  module.exports = Formation;
  