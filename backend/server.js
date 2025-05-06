require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sequelize = require('./db');
const setupAssociations = require('./models/associations');
const authenticateToken = require('./middlewares/auth');

const User = require('./models/Users');
const Article = require('./models/Articles');
const Formation = require('./models/Formations');
const Appointment = require('./models/Appointments');
const VideosPodcast = require('./models/VideosPodcast');
const Directory = require('./models/Directory');
const UserFormation = require('./models/UserFormation');
const Chapter = require('./models/Chapters');

const app = express();
const SECRET = process.env.JWT_SECRET;

setupAssociations();

// Création des dossiers
const uploadDir = path.join(__dirname, 'uploads');
const videoDir = path.join(__dirname, 'videos');
const videoPodcastDir = path.join(__dirname, 'videoPodcasts');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir);
if (!fs.existsSync(videoPodcastDir)) fs.mkdirSync(videoPodcastDir);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));
app.use('/videos', express.static(videoDir));
app.use('/videoPodcasts', express.static(videoPodcastDir));

// Multer : images
const imageStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const imageFilter = (_, file, cb) => {
  file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Seules les images sont autorisées'), false);
};
const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter });

// Multer : vidéos
const videoStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'videos/'),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const videoFilter = (_, file, cb) => {
  file.mimetype.startsWith('video/') ? cb(null, true) : cb(new Error('Seules les vidéos sont autorisées'), false);
};
const uploadVideo = multer({ storage: videoStorage, fileFilter: videoFilter });

// Multer : vidéos/podcasts
const vpStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'videoPodcasts/'),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const vpFilter = (_, file, cb) => {
  const isValid = file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/');
  isValid ? cb(null, true) : cb(new Error('Seuls les fichiers audio ou vidéo sont autorisés'), false);
};
const uploadVP = multer({ storage: vpStorage, fileFilter: vpFilter });

/* --- AUTH --- */
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email déjà utilisé' });

    const newUser = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'Utilisateur créé', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Email ou mot de passe invalide' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '1d' });
    res.json({ message: 'Connexion réussie', token, user });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

/* --- USERS --- */
app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erreur création utilisateur' });
  }
});

app.get('/api/users', async (_, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Erreur récupération utilisateurs' });
  }
});

/* --- ARTICLES --- */
app.post('/api/articles', uploadImage.single('image'), async (req, res) => {
  try {
    const { title, description, content } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : '';
    const article = await Article.create({ title, description, content, image });
    res.json(article);
  } catch {
    res.status(500).json({ error: 'Erreur création article' });
  }
});

app.get('/api/articles', async (_, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch {
    res.status(500).json({ error: 'Erreur récupération articles' });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    article ? res.json(article) : res.status(404).json({ error: 'Article non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur récupération article' });
  }
});

/* --- FORMATIONS + CHAPITRES --- */
const uploadMixed = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = file.mimetype.startsWith('image/') ? 'uploads/' : 'videos/';
      cb(null, dest);
    },
    filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  }),
});

app.post('/api/formations', uploadMixed.any(), async (req, res) => {
  try {
    const { title, description, content, price } = req.body;
    const image = req.files.find(f => f.fieldname === 'image')?.path || null;

    const formation = await Formation.create({ title, description, content, price, image });

    const chaptersRaw = JSON.parse(req.body.chapters || '[]');
    const chapters = [];

    for (let i = 0; i < chaptersRaw.length; i++) {
      const chapterData = chaptersRaw[i];
      const videoFile = req.files.find(f => f.fieldname === chapterData.videoField);

      const chapter = await Chapter.create({
        title: chapterData.title,
        description: chapterData.description || '',
        video: videoFile?.path || null,
        formationId: formation.id
      });

      chapters.push(chapter);
    }

    res.status(201).json({ formation, chapters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur création formation' });
  }
});

app.get('/api/formations', async (_, res) => {
  try {
    const formations = await Formation.findAll({ include: [{ model: Chapter, as: 'chapters' }] });
    res.json(formations);
  } catch {
    res.status(500).json({ error: 'Erreur récupération formations' });
  }
});

app.get('/api/formations/:id', async (req, res) => {
  try {
    const formation = await Formation.findByPk(req.params.id, {
      include: [{ model: Chapter, as: 'chapters' }]
    });
    formation ? res.json(formation) : res.status(404).json({ error: 'Formation non trouvée' });
  } catch {
    res.status(500).json({ error: 'Erreur récupération formation' });
  }
});

/* --- CHAPTERS INDIVIDUELS --- */
app.post('/api/formations/:formationId/chapters', uploadVideo.single('video'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const { formationId } = req.params;

    const chapter = await Chapter.create({
      title,
      description,
      video: req.file ? req.file.path.replace(/\\/g, '/') : '',
      formationId
    });

    res.json(chapter);
  } catch {
    res.status(500).json({ error: 'Erreur création chapitre' });
  }
});

app.get('/api/formations/:formationId/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.findAll({ where: { formationId: req.params.formationId } });
    res.json(chapters);
  } catch {
    res.status(500).json({ error: 'Erreur récupération chapitres' });
  }
});

/* --- APPOINTMENTS --- */
app.post('/api/appointments', uploadImage.single('image'), async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : '';
    const appointment = await Appointment.create({ title, description, link, image });
    res.json(appointment);
  } catch {
    res.status(500).json({ error: 'Erreur prise de rendez-vous' });
  }
});

app.get('/api/appointments', async (_, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch {
    res.status(500).json({ error: 'Erreur récupération rendez-vous' });
  }
});

/* --- VIDEOS & PODCASTS --- */
app.post('/api/videos-podcasts', uploadVP.single('file'), async (req, res) => {
  try {
    const { title, themes, description } = req.body;
    
    // Vérifie si un fichier a bien été téléchargé
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier téléchargé' });
    }
    // Créer l'enregistrement dans la base de données
    const videoPodcast = await VideosPodcast.create({
      title, 
      themes, 
      description, 
      file: req.file.path.replace(/\\/g, '/')  // Chemin du fichier
    });

    res.status(201).json({ message: 'Vidéos/Podcast téléchargé avec succès', videoPodcast });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’upload du fichier' });
  }
});


app.get('/api/videos-podcasts', async (_, res) => {
  try {
    const items = await VideosPodcast.findAll();
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Erreur récupération vidéos/podcasts' });
  }
});

app.get('/api/videos-podcasts/:id', async (req, res) => {
  try {
    const item = await VideosPodcast.findByPk(req.params.id);
    item ? res.json(item) : res.status(404).json({ error: 'Non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur récupération contenu' });
  }
});

/* --- DIRECTORY --- */
app.post('/api/directories', uploadImage.single('image'), async (req, res) => {
  try {
    const directory = await Directory.create({
      name: req.body.name,
      description: req.body.description,
      image: req.file ? req.file.path.replace(/\\/g, '/') : ''
    });
    res.json(directory);
  } catch {
    res.status(500).json({ error: 'Erreur création directory' });
  }
});

app.get('/api/directories', async (_, res) => {
  try {
    const directories = await Directory.findAll();
    res.json(directories);
  } catch {
    res.status(500).json({ error: 'Erreur récupération directories' });
  }
});

/* --- ASSOCIATION USER <-> FORMATION --- */
app.post('/api/users/:userId/formations/:formationId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const formation = await Formation.findByPk(req.params.formationId);
    if (!user || !formation) return res.status(404).json({ error: 'Introuvable' });

    await user.addFormation(formation);
    res.json({ message: 'Formation assignée' });
  } catch {
    res.status(500).json({ error: 'Erreur association formation' });
  }
});

app.get('/api/users/:userId/formations', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, { include: Formation });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user.Formations);
  } catch {
    res.status(500).json({ error: 'Erreur récupération formations' });
  }
});

app.get('/api/my-formations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { include: Formation });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user.Formations);
  } catch {
    res.status(500).json({ error: 'Erreur récupération formations' });
  }
});

app.get('/api/my-formations/:id', authenticateToken, async (req, res) => {
  try {
    const formation = await Formation.findByPk(req.params.id, {
      include: [{ model: Chapter, as: 'chapters' }]
    });
    if (!formation) return res.status(404).json({ error: 'Formation non trouvée' });
    res.json(formation);
  } catch (error) {
    console.error('Erreur Sequelize :', error);
    res.status(500).json({ error: 'Erreur chargement formation' });
  }
});

app.post('/api/my-formations/:formationId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const formation = await Formation.findByPk(req.params.formationId);
    if (!formation) return res.status(404).json({ error: 'Formation non trouvée' });

    const user = await User.findByPk(userId);
    await user.addFormation(formation);
    res.json({ message: 'Formation ajoutée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’ajout de la formation' });
  }
});
// Définir la fonction pour créer l'admin par défaut
const createDefaultAdmin = async () => {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.DEFAULT_ADMIN_NAME || 'Admin';

  try {
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`✅ Utilisateur admin créé : ${adminEmail}`);
    } else {
      console.log('ℹ️ Utilisateur admin déjà existant.');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de l’admin :', error);
  }
};

// Synchronisation de la base de données et création de l'admin par défaut
const PORT = process.env.PORT || 5000;  // Valeur par défaut pour PORT
sequelize.sync()
  .then(async () => {
    console.log('✅ Base de données synchronisée');
    await createDefaultAdmin(); // <-- appel de la fonction pour créer l'admin
    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur lors de la synchronisation de la base de données :', err);
  });