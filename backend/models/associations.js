const User = require('./Users');
const Formation = require('./Formations');
const UserFormation = require('./UserFormation');

function setupAssociations() {
  User.belongsToMany(Formation, { through: UserFormation, foreignKey: 'userId' });
  Formation.belongsToMany(User, { through: UserFormation, foreignKey: 'formationId' });
}

module.exports = setupAssociations;
