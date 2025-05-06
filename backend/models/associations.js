const User = require('./Users');
const Formation = require('./Formations');
const UserFormation = require('./UserFormation');
const Chapter = require('./Chapters');

function setupAssociations() {
  User.belongsToMany(Formation, { through: UserFormation, foreignKey: 'userId' });
  Formation.belongsToMany(User, { through: UserFormation, foreignKey: 'formationId' });
}


Formation.hasMany(Chapter, { foreignKey: 'formationId', as: 'chapters' });
Chapter.belongsTo(Formation, { foreignKey: 'formationId' });

module.exports = setupAssociations;
