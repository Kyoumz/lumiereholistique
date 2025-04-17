// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const User = require('./models/Users');
const Article = require('./models/Articles');
const Formation = require('./models/Formations');
const Appointment = require('./models/Appointments');
const VideosPodcast = require('./models/VideosPodcast');
const Directory = require('./models/Directory');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

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

// Route to fetch an article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findByPk(articleId);

    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: 'Article non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
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

// **New route to fetch a formation by ID**
app.get('/api/formations/:id', async (req, res) => {
  try {
    const formationId = req.params.id;
    const formation = await Formation.findByPk(formationId); // Use Sequelize method to find by primary key

    if (formation) {
      res.json(formation);
    } else {
      res.status(404).json({ error: 'Formation non trouvée' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la formation' });
  }
});

// Routes rendez-vous
app.post('/api/appointments', async (req, res) => {
  try {
    console.log('Données reçues :', req.body);
    const appointment = await Appointment.create(req.body);
    res.json(appointment);
  } catch (err) {
    console.error(err);
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


// Routes VideosPodcast

app.post('/api/videos-podcasts', async (req, res) => {
  try {
    const item = await VideosPodcast.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du contenu vidéo/podcast' });
  }
});

app.get('/api/videos-podcasts', async (req, res) => {
  try {
    const items = await VideosPodcast.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des contenus vidéos/podcasts' });
  }
});

app.get('/api/videos-podcasts/:id', async (req, res) => {
  try {
    const item = await VideosPodcast.findByPk(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Vidéo/Podcast non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du contenu' });
  }
});

app.post('/api/directories', async (req, res) => {
  try {
    const directory = await Directory.create(req.body);
    res.json(directory);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du directory' });
  }
});

app.get('/api/directories', async (req, res) => {
  try {
    const directories = await Directory.findAll();
    res.json(directories);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des directories' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d’exécution sur le port ${PORT}`);
});
