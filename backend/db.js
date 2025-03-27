// db.js
const { Sequelize } = require('sequelize');

// Créer une instance Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nom de la base de données
  process.env.DB_USER,     // Utilisateur de la base de données
  process.env.DB_PASSWORD, // Mot de passe
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',   // Type de base de données
    port: process.env.DB_PORT,
    logging: false,        // Pour désactiver les logs SQL
  }
);

// Vérifier la connexion à la base de données
sequelize.authenticate()
  .then(() => console.log('Connection to PostgreSQL has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
