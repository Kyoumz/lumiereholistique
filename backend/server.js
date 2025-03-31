// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const User = require('./models/Users');
const Article = require('./models/Articles')
const Formation = require('./models/Formations');
const Appointment = require('./models/Appointments');

const app = express();
app.use(cors());
app.use(express.json());

// Routes utilisateurs
app.post('/api/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de l’utilisateur' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Routes articles et conseils
app.post('/api/articles', async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de l’article' });
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
  }
});

// Routes formations
app.post('/api/formations', async (req, res) => {
  try {
    const formation = await Formation.create(req.body);
    res.json(formation);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de la formation' });
  }
});

app.get('/api/formations', async (req, res) => {
  try {
    const formations = await Formation.findAll();
    res.json(formations);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des formations' });
  }
});

// Routes rendez-vous
app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la prise de rendez-vous' });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Serveur en cours d’exécution sur le port ${PORT}');
});
