const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UserFormation = sequelize.define('UserFormation', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    }
  },
  formationId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Formations',
      key: 'id',
    }
  }
});

module.exports = UserFormation;
