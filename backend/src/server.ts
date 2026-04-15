export {};
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const db = require('../models');

const app = express();
const PORT = 5000;

// ── uploads dir ────────────────────────────────────────────────────
const UPLOADS = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });

// ── multer: disk storage ───────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_: any, __: any, cb: any) => cb(null, UPLOADS),
  filename:    (_: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_: any, file: any, cb: any) => {
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname) ? cb(null, true) : cb(new Error('Images only'));
  },
});

// ── middlewares ────────────────────────────────────────────────────
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200'],
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use('/uploads', express.static(UPLOADS));

// ── UPLOAD IMAGES ──────────────────────────────────────────────────
app.post('/api/upload', upload.array('images', 10), (req: any, res: any) => {
  if (!req.files?.length) return res.status(400).json({ success: false });
  const urls = (req.files as any[]).map(f => `http://localhost:${PORT}/uploads/${f.filename}`);
  res.json({ success: true, urls });
});

// ── ARTICLES ───────────────────────────────────────────────────────
const articleRouter = require('./articlerouter');
app.use('/article', articleRouter);

// ── MESSAGES ───────────────────────────────────────────────────────
app.get('/api/messages/by-receiver/:id', async (req: any, res: any) => {
  try {
    const msgs = await db.Message.findAll({
      where: { receiverId: req.params.id },
      include: [{ model: db.Article, as: 'article', include: [{ model: db.User, as: 'User', attributes: ['id','firstName','lastName'] }] }],
      order: [['createdAt','ASC']],
    });
    res.json(msgs.map((m: any) => ({
      id: m.id, senderId: m.senderId, receiverId: m.receiverId,
      content: m.content, isRead: m.isRead || false,
      createdAt: m.createdAt, articleId: m.articleId,
      article: m.article ? { id: m.article.id, title: m.article.title, type: m.article.type, statut: m.article.statut, user: { id: m.article.User?.id } } : null,
    })));
  } catch(e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.get('/api/messages/by-sender/:id', async (req: any, res: any) => {
  try {
    const msgs = await db.Message.findAll({
      where: { senderId: req.params.id },
      include: [{ model: db.Article, as: 'article', include: [{ model: db.User, as: 'User', attributes: ['id'] }] }],
      order: [['createdAt','ASC']],
    });
    res.json(msgs.map((m: any) => ({
      id: m.id, senderId: m.senderId, receiverId: m.receiverId,
      content: m.content, isRead: m.isRead || false,
      createdAt: m.createdAt, articleId: m.articleId,
      article: m.article ? { id: m.article.id, title: m.article.title, type: m.article.type, statut: m.article.statut, user: { id: m.article.User?.id } } : null,
    })));
  } catch(e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.post('/api/messages', async (req: any, res: any) => {
  try {
    const { senderId, receiverId, content, articleId } = req.body;
    if (!senderId || !receiverId || !content) return res.status(400).json({ error: 'Champs manquants' });
    const msg = await db.Message.create({ senderId, receiverId, content, articleId });
    res.status(201).json(msg);
  } catch(e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.patch('/api/messages/:id/read', async (req: any, res: any) => {
  try {
    await db.Message.update({ isRead: true }, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

// ── AUTH ───────────────────────────────────────────────────────────
app.post('/api/signup', async (req: any, res: any) => {
  try {
    const u = await db.User.create({ firstName: req.body.firstname, lastName: req.body.lastname, email: req.body.email, password: req.body.password, city: req.body.ville, address: req.body.address, pdp: req.body.pdp || '', confirmcode: req.body.confirmcode, isConfirmed: false });
    res.json({ success: true, user: u });
  } catch(e) { res.status(500).json({ success: false }); }
});

app.post('/api/users/:id/confirm', async (req: any, res: any) => {
  const [n] = await db.User.update({ isConfirmed: true }, { where: { id: req.params.id } });
  n > 0 ? res.json({ success: true }) : res.status(404).json({ success: false });
});

app.post('/api/resend-confirmation', async (req: any, res: any) => {
  const u = await db.User.findOne({ where: { email: req.body.email } });
  u ? res.json({ success: true }) : res.status(404).json({ success: false });
});

app.post('/api/forgotPassword', async (req: any, res: any) => {
  const u = await db.User.findOne({ where: { email: req.body.email } });
  if (!u) return res.status(404).json({ success: false });
  u.forgotPassword = req.body.forgotPassword; await u.save();
  res.json({ success: true });
});

app.post('/api/onchangepassword/:email', async (req: any, res: any) => {
  const u = await db.User.findOne({ where: { email: req.params.email } });
  if (!u) return res.status(404).json({ success: false });
  u.password = bcrypt.hashSync(req.body.newPassword, 10); await u.save();
  res.json({ success: true });
});

// ── USERS ──────────────────────────────────────────────────────────
app.get('/users', async (_: any, res: any) => {
  const users = await db.User.findAll({ where: { isAdmin: false } });
  res.json(users);
});
app.get('/admin', async (_: any, res: any) => {
  const u = await db.User.findOne({ where: { isAdmin: true } });
  res.json(u);
});
app.get('/api/users/:id', async (req: any, res: any) => {
  const u = await db.User.findByPk(parseInt(req.params.id));
  u ? res.json(u) : res.status(404).json({ message: 'Not found' });
});
app.get('/api/check-email/:email', async (req: any, res: any) => {
  const u = await db.User.findOne({ where: { email: req.params.email } });
  res.json({ exists: !!u });
});
app.get('/api/:email', async (req: any, res: any) => {
  try {
    const u = await db.User.findOne({ where: { email: req.params.email } });
    u ? res.json(u) : res.status(404).json({ errorMessage: true });
  } catch(e) { res.status(500).json({ message: 'Erreur' }); }
});
app.post('/api/update-user/:id', async (req: any, res: any) => {
  try {
    const u = await db.User.findByPk(parseInt(req.params.id));
    if (!u) return res.status(404).json({ success: false });
    const { firstName, lastName, city, address, pdp, password } = req.body;
    if (firstName) u.firstName = firstName;
    if (lastName)  u.lastName  = lastName;
    if (city)      u.city      = city;
    if (address)   u.address   = address;
    if (pdp)       u.pdp       = pdp;
    if (password)  u.password  = password;
    await u.save();
    res.json({ success: true });
  } catch(e) { res.status(500).json({ success: false }); }
});
app.post('/api/users/delete', async (req: any, res: any) => {
  const u = await db.User.findByPk(req.body.id);
  if (!u) return res.status(404).json({ success: false });
  await u.destroy(); res.json({ success: true });
});

// ── FAVORITES ──────────────────────────────────────────────────────
app.get('/favorite', async (_: any, res: any) => {
  const favs = await db.Favorite.findAll({ attributes: { exclude: ['createdAt','updatedAt'] } });
  res.json(favs);
});
app.post('/addfavorite', async (req: any, res: any) => {
  try {
    const { articleId, userId } = req.body;
    const art = await db.Article.findByPk(articleId);
    if (!art) return res.status(404).json({ error: 'Article non trouvé' });
    const existing = await db.Favorite.findOne({ where: { userId, articleId } });
    if (existing) {
      await db.Favorite.destroy({ where: { userId, articleId } });
      return res.json({ success: true, removed: true });
    }
    await db.Favorite.create({ userId, articleId });
    res.status(201).json({ success: true, removed: false });
  } catch(e) { res.status(500).json({ error: 'Erreur serveur' }); }
});

// ── START ──────────────────────────────────────────────────────────
db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀  Clothed API → http://localhost:${PORT}`));
});
