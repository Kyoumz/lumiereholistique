require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendMail = require('./models/mailer');
const crypto = require('crypto');
const { Op } = require('sequelize');
const sequelize = require('./db');
const setupAssociations = require('./models/associations');
const authenticateToken = require('./middlewares/auth');

const Stripe = require('stripe');
const User = require('./models/Users');
const Article = require('./models/Articles');
const Comment = require('./models/Comment');
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

/**STRIPE */

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
app.post('/create-checkout-session', async (req, res) => {
  const { formationId } = req.body;

  try {
    const formation = await Formation.findByPk(formationId);
    if (!formation) return res.status(404).json({ error: 'Formation non trouvée' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: formation.title },
          unit_amount: Math.round(formation.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:4200/mycours',
      
      cancel_url: 'http://localhost:4200/formation',
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const formationId = session.metadata.formationId;
    const userId = session.metadata.userId;

    if (formationId && userId) {
      try {
        // 🔁 Ajoute ici ta logique : lier la formation à l'utilisateur
        await UserFormation.create({ userId, formationId });
        console.log(`[Stripe] Formation ${formationId} achetée par user ${userId}`);
      } catch (err) {
        console.error('Erreur assignation formation post-achat', err);
      }
    }
  }

  res.status(200).json({ received: true });
});


/* --- AUTH --- */

app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // si tu hashes

    // Génère le token unique
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationUrl = `http://localhost:5000/api/verify-email?token=${verificationToken}`;

    // Crée l'utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
      isVerified: false, 
    });

    // Envoie l'email
    await sendMail(
      email,
      'Confirme ton inscription',
      `<h2>Bienvenue ${name} 👋</h2>
       <p>Clique sur le lien suivant pour confirmer ton compte :</p>
       <a href="${verificationUrl}">${verificationUrl}</a>
       <p>Si tu n’as pas demandé ça, ignore simplement cet email.</p>`
    );

    res.status(201).json({ message: 'Utilisateur créé. Vérifie ton email.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
});

app.post('/api/verify-email', async (req, res) => {
  const token = req.query.token;

  const user = await User.findOne({ where: { verificationToken: token } });

  if (!user) {
    return res.redirect('http://localhost:4200/verify-email?status=invalid');
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  return res.redirect('http://localhost:4200/verify-email?status=success');
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
    const article = await Article.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: ['id', 'author', 'content', 'createdAt'], // choisis les champs que tu veux renvoyer
        },
      ],
    });

    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json(article);
  } catch (err) {
    console.error('Erreur récupération article :', err);
    res.status(500).json({ error: 'Erreur récupération article' });
  }
});

/*COMMNENT*/

app.post('/api/articles/:articleId/comments', async (req, res) => {
  const { author, content } = req.body;
  const { articleId } = req.params;

  try {
    const article = await Article.findByPk(articleId);
    if (!article) return res.status(404).json({ error: 'Article non trouvé' });

    const comment = await article.createComment({ author, content });
    res.status(201).json(comment);
  } catch (err) {
    console.error('Erreur création commentaire :', err);
    res.status(500).json({ error: 'Erreur création commentaire' });
  }
});

app.get('/api/articles/:articleId/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { articleId: req.params.articleId },
      order: [['createdAt', 'DESC']],
    });
    res.json(comments);
  } catch (err) {
    console.error('Erreur récupération commentaires :', err);
    res.status(500).json({ error: 'Erreur récupération commentaires' });
  }
});

app.put('/api/articles/:articleId/comments/:commentId', async (req, res) => {
  const { content, author } = req.body;
  const { articleId, commentId } = req.params;

  try {
    const comment = await Comment.findOne({
      where: { id: commentId, articleId: articleId },
    });

    if (!comment) return res.status(404).json({ error: 'Commentaire non trouvé' });

    comment.content = content ?? comment.content;
    comment.author = author ?? comment.author;
    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error('Erreur mise à jour commentaire :', err);
    res.status(500).json({ error: 'Erreur mise à jour commentaire' });
  }
});

app.delete('/api/articles/:articleId/comments/:commentId', async (req, res) => {
  const { articleId, commentId } = req.params;

  try {
    const deleted = await Comment.destroy({
      where: { id: commentId, articleId: articleId },
    });

    if (!deleted) return res.status(404).json({ error: 'Commentaire non trouvé' });

    res.json({ message: 'Commentaire supprimé' });
  } catch (err) {
    console.error('Erreur suppression commentaire :', err);
    res.status(500).json({ error: 'Erreur suppression commentaire' });
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

/* --- UPDATE & DELETE --- */

// Appointments
app.put('/api/appointments/:id', uploadImage.single('image'), async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Rendez-vous non trouvé' });

    const image = req.file ? req.file.path.replace(/\\/g, '/') : appointment.image;
    await appointment.update({ ...req.body, image });
    res.json(appointment);
  } catch {
    res.status(500).json({ error: 'Erreur modification rendez-vous' });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const deleted = await Appointment.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Rendez-vous supprimé' }) : res.status(404).json({ error: 'Non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression rendez-vous' });
  }
});

// Articles
app.put('/api/articles/:id', uploadImage.single('image'), async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article non trouvé' });

    const image = req.file ? req.file.path.replace(/\\/g, '/') : article.image;
    await article.update({ ...req.body, image });
    res.json(article);
  } catch {
    res.status(500).json({ error: 'Erreur modification article' });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const deleted = await Article.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Article supprimé' }) : res.status(404).json({ error: 'Non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression article' });
  }
});

// Chapters
app.put('/api/chapters/:id', uploadVideo.single('video'), async (req, res) => {
  try {
    const chapter = await Chapter.findByPk(req.params.id);
    if (!chapter) return res.status(404).json({ error: 'Chapitre non trouvé' });

    const video = req.file ? req.file.path.replace(/\\/g, '/') : chapter.video;
    await chapter.update({ ...req.body, video });
    res.json(chapter);
  } catch {
    res.status(500).json({ error: 'Erreur modification chapitre' });
  }
});

app.delete('/api/chapters/:id', async (req, res) => {
  try {
    const deleted = await Chapter.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Chapitre supprimé' }) : res.status(404).json({ error: 'Non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression chapitre' });
  }
});

// Directories
app.put('/api/directories/:id', uploadImage.single('image'), async (req, res) => {
  try {
    const directory = await Directory.findByPk(req.params.id);
    if (!directory) return res.status(404).json({ error: 'Élément non trouvé' });

    const image = req.file ? req.file.path.replace(/\\/g, '/') : directory.image;
    await directory.update({ ...req.body, image });
    res.json(directory);
  } catch {
    res.status(500).json({ error: 'Erreur modification directory' });
  }
});

app.delete('/api/directories/:id', async (req, res) => {
  try {
    const deleted = await Directory.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Élément supprimé' }) : res.status(404).json({ error: 'Non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression directory' });
  }
});

// Formations
app.put('/api/formations/:id', uploadImage.single('image'), async (req, res) => {
  try {
    const formation = await Formation.findByPk(req.params.id);
    if (!formation) return res.status(404).json({ error: 'Formation non trouvée' });

    const image = req.file ? req.file.path.replace(/\\/g, '/') : formation.image;
    await formation.update({ ...req.body, image });
    res.json(formation);
  } catch {
    res.status(500).json({ error: 'Erreur modification formation' });
  }
});

app.delete('/api/formations/:id', async (req, res) => {
  try {
    const deleted = await Formation.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Formation supprimée' }) : res.status(404).json({ error: 'Non trouvée' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression formation' });
  }
});

// UserFormations
app.delete('/api/users/:userId/formations/:formationId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const formation = await Formation.findByPk(req.params.formationId);
    if (!user || !formation) return res.status(404).json({ error: 'Introuvable' });

    await user.removeFormation(formation);
    res.json({ message: 'Formation retirée de l’utilisateur' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression de la formation de l’utilisateur' });
  }
});

// Users
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    await user.update(req.body);
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erreur modification utilisateur' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Utilisateur supprimé' }) : res.status(404).json({ error: 'Non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression utilisateur' });
  }
});

// VideosPodcasts
app.put('/api/videos-podcasts/:id', uploadVP.single('file'), async (req, res) => {
  try {
    const item = await VideosPodcast.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Contenu non trouvé' });

    const file = req.file ? req.file.path.replace(/\\/g, '/') : item.file;
    await item.update({ ...req.body, file });
    res.json(item);
  } catch {
    res.status(500).json({ error: 'Erreur modification vidéo/podcast' });
  }
});

app.delete('/api/videos-podcasts/:id', async (req, res) => {
  try {
    const deleted = await VideosPodcast.destroy({ where: { id: req.params.id } });
    deleted ? res.json({ message: 'Supprimé avec succès' }) : res.status(404).json({ error: 'Non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression vidéo/podcast' });
  }
});

app.get('/api/directories/:id', async (req, res) => {
  try {
    const directory = await Directory.findByPk(req.params.id);
    directory ? res.json(directory) : res.status(404).json({ error: 'Élément non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur récupération directory' });
  }
});

app.get('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    appointment ? res.json(appointment) : res.status(404).json({ error: 'Rendez-vous non trouvé' });
  } catch {
    res.status(500).json({ error: 'Erreur récupération rendez-vous' });
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



app.post('/api/contact', async (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const subject = `Nouveau message de contact de ${nom}`;
  const html = `
    <h2>Message de : ${nom}</h2>
    <p><strong>Email :</strong> ${email}</p>
    <p><strong>Message :</strong><br>${message}</p>
  `;

  try {
    await sendMail(process.env.RECEIVER_EMAIL, subject, html);
    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l’envoi de l’email' });
  }
});

app.get('/api/verify-email', async (req, res) => {
  try {
    const token = req.query.token;
    console.log('Token reçu:', token);

    if (!token) {
      console.log('Pas de token fourni.');
      return res.redirect('http://localhost:4200/verify-email?status=invalid');
    }

    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      console.log('Aucun utilisateur trouvé pour ce token.');
      return res.redirect('http://localhost:4200/verify-email?status=invalid');
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    console.log('Utilisateur vérifié :', user.email);

    return res.redirect('http://localhost:4200/verify-email?status=success');
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email :', error);
    return res.redirect('http://localhost:4200/verify-email?status=invalid');
  }
});


app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: new Date() }
    }
  });

  if (!user) {
    return res.status(400).json({ error: 'Lien invalide ou expiré' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ message: 'Mot de passe mis à jour. Tu peux te connecter.' });
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ error: 'Utilisateur non trouvé' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1h

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  await user.save();

  const resetLink = `http://localhost:4200/reset-password?token=${token}`;

  await sendMail(
    email,
    'Réinitialisation de mot de passe',
    `<h3>Bonjour ${user.name}</h3>
     <p>Tu as demandé à réinitialiser ton mot de passe.</p>
     <p><a href="${resetLink}">Clique ici pour définir un nouveau mot de passe</a></p>
     <p>Ce lien est valide 1 heure.</p>`
  );

  res.json({ message: 'Email envoyé avec les instructions.' });
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
        isVerified:true,
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