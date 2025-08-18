const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcryptjs');
const Formation = require('./Formations');

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
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
  },  
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      try {
        user.password = await bcrypt.hash(user.password, 10);
      } catch (error) {
        console.error('Erreur lors du hash du mot de passe :', error);
        throw error;
      }
    }
  }
});

sequelize.sync()
.then(() => console.log('users table has been created or exists.'))
.catch((err) => console.error('Unable to create table:', err));

module.exports = User;
