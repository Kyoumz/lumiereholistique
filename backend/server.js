require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const multer = require('multer');
const path = require('path');
const User = require('./models/Users');
const Article = require('./models/Articles');
const Formation = require('./models/Formations');
const Appointment = require('./models/Appointments');
const VideosPodcast = require('./models/VideosPodcast');
const Directory = require('./models/Directory');
const authenticateToken = require('./middlewares/auth');
const UserFormation = require('./models/UserFormation'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET; 
const setupAssociations = require('./models/associations');
setupAssociations(); 
const app = express();
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('📁 Dossier "uploads/" créé automatiquement');
}


// Configuration de multer pour gérer les fichiers image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les images seront stockées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Crée un nom unique pour chaque fichier
  }
});

// Filtre de type de fichier
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Si c'est une image, on l'accepte
  } else {
    cb(new Error('Seules les images sont autorisées'), false); // Sinon, on rejette le fichier
  }
};

const upload = multer({ storage, fileFilter });

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Inscription
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const newUser = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
});

// Connexion
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe invalide' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe invalide' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Connexion réussie', token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

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
app.post('/api/articles', upload.single('image'), async (req, res) => {
  try {
    const { title, description, content } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : ''; // chemin de l'image

    const article = await Article.create({
      title,
      description,
      content,
      image
    });

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

// Route pour récupérer un article par ID
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

// Routes formations avec upload d'images
app.post('/api/formations', upload.single('image'), async (req, res) => {
  try {
    const { title, description, content, price } = req.body;
    const imagePath = req.file ? req.file.path : null; // Si une image est téléchargée, on prend son chemin

    const formation = await Formation.create({
      title,
      description,
      content,
      price,
      image: imagePath 
    });

    res.json(formation);
  } catch (err) {
    console.error(err);
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

// **Nouvelle route pour récupérer une formation par ID**
app.get('/api/formations/:id', async (req, res) => {
  try {
    const formationId = req.params.id;
    const formation = await Formation.findByPk(formationId);

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

// Routes Directory
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

// Routes pour l'association entre un utilisateur et une formation
app.post('/api/users/:userId/formations/:formationId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const formation = await Formation.findByPk(req.params.formationId);

    if (!user || !formation) {
      return res.status(404).json({ error: 'Utilisateur ou formation introuvable' });
    }

    await user.addFormation(formation);
    res.json({ message: 'Formation assignée à l’utilisateur avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’association' });
  }
});

app.get('/api/users/:userId/formations', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId, {
      include: Formation
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user.Formations);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des formations' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d’exécution sur le port ${PORT}`);
});
