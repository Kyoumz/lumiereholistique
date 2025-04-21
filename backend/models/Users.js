const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcryptjs');

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
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
hooks: {
  beforeCreate: async (user) => {
    try {
      console.log('Hashing password...');
      user.password = await bcrypt.hash(user.password, 10);
      console.log('Password hashed.');
    } catch (error) {
      console.error('Error while hashing password:', error);
      throw error;
    }
  }

  }
});

sequelize.sync()
  .then(() => console.log('User table has been created or exists.'))
  .catch((err) => console.error('Unable to create table:', err));

module.exports = User;
