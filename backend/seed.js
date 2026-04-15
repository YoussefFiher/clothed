/**
 * Clothed — Seed Script
 * ---------------------
 * Remplit la base de données avec des données de demo realistes.
 * Usage: node seed.js
 */

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// ── Config ────────────────────────────────────────────
const config = require('./config/config.json').development;
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host, dialect: config.dialect, logging: false,
});

// ── Models (inline) ───────────────────────────────────
const User = sequelize.define('User', {
  firstName:   { type: DataTypes.STRING },
  lastName:    { type: DataTypes.STRING },
  email:       { type: DataTypes.STRING, unique: true },
  password:    { type: DataTypes.STRING },
  city:        { type: DataTypes.STRING },
  address:     { type: DataTypes.STRING },
  pdp:         { type: DataTypes.TEXT,   defaultValue: '' },
  isConfirmed: { type: DataTypes.BOOLEAN, defaultValue: true },
  isAdmin:     { type: DataTypes.BOOLEAN, defaultValue: false },
  confirmcode: { type: DataTypes.STRING, defaultValue: 'DEMO' },
}, { tableName: 'Users' });

const Article = sequelize.define('Article', {
  title:       { type: DataTypes.STRING },
  type:        { type: DataTypes.STRING },
  sous_type:   { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  statut:      { type: DataTypes.STRING, defaultValue: 'libre' },
  userId:      { type: DataTypes.INTEGER },
}, { tableName: 'Articles' });

const Image = sequelize.define('Image', {
  path:      { type: DataTypes.TEXT },
  articleId: { type: DataTypes.INTEGER },
}, { tableName: 'Images' });

const Message = sequelize.define('Message', {
  senderId:   { type: DataTypes.INTEGER },
  receiverId: { type: DataTypes.INTEGER },
  content:    { type: DataTypes.TEXT },
  isRead:     { type: DataTypes.BOOLEAN, defaultValue: false },
  articleId:  { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'Messages' });

const Favorite = sequelize.define('Favorite', {
  userId:    { type: DataTypes.INTEGER },
  articleId: { type: DataTypes.INTEGER },
}, { tableName: 'FavoriteArticle' });

// ── Sample data ───────────────────────────────────────
const USERS = [
  { firstName:'Sophie',  lastName:'Martin',  email:'sophie.martin@clothed.be',   city:'Bruxelles', address:'Rue de la Loi 12',      isAdmin: true  },
  { firstName:'Lucas',   lastName:'Dubois',  email:'lucas.dubois@clothed.be',     city:'Liège',     address:'Avenue Blonden 45'      },
  { firstName:'Emma',    lastName:'Bernard', email:'emma.bernard@clothed.be',     city:'Gand',      address:'Korenmarkt 7'           },
  { firstName:'Noah',    lastName:'Thomas',  email:'noah.thomas@clothed.be',      city:'Bruges',    address:'Markt 1'                },
  { firstName:'Camille', lastName:'Robert',  email:'camille.robert@clothed.be',   city:'Namur',     address:'Place Saint-Aubain 3'   },
  { firstName:'Louis',   lastName:'Petit',   email:'louis.petit@clothed.be',      city:'Charleroi', address:'Boulevard Tirou 20'     },
  { firstName:'Léa',     lastName:'Durand',  email:'lea.durand@clothed.be',       city:'Louvain',   address:'Naamsestraat 100'       },
  { firstName:'Hugo',    lastName:'Moreau',  email:'hugo.moreau@clothed.be',      city:'Mons',      address:'Grand Place 2'          },
];

const ARTICLES = [
  // Homme
  { title:'Veste en jean bleue — Taille M',            type:'Homme',  sous_type:'Manteaux et Vestes',      description:'Belle veste en jean, très peu portée. Lavage facile, pas de défaut.',               statut:'libre'  },
  { title:'Pantalon chino beige — W32/L34',            type:'Homme',  sous_type:'Pantalon',                description:'Pantalon chino slim fit, couleur sable. État impeccable.',                          statut:'libre'  },
  { title:'Chemise Oxford blanc cassé — M',            type:'Homme',  sous_type:'Hauts et T-shirt',        description:'Chemise Oxford classique, col boutonné. Portée 2-3 fois seulement.',                statut:'libre'  },
  { title:'Sweat gris à capuche — L',                  type:'Homme',  sous_type:'Hauts et T-shirt',        description:'Sweatshirt comfortable, légèrement utilisé. Idéal pour le quotidien.',               statut:'retenu' },
  { title:'Costume bleu marine 2 pièces — 42',         type:'Homme',  sous_type:'Costumes',                description:'Costume 2 pièces, veste + pantalon. Porté une seule fois pour une cérémonie.',      statut:'libre'  },
  // Femme
  { title:'Robe fleurie été — Taille 38',              type:'Femme',  sous_type:'Robe',                    description:'Robe légère à motifs fleuris, parfaite pour l\'été. Très bon état.',                 statut:'libre'  },
  { title:'Manteau camel mi-long — Taille S',          type:'Femme',  sous_type:'Manteaux et veste',       description:'Élégant manteau camel, doublure intérieure chaude. Porté 2 hivers.',                 statut:'libre'  },
  { title:'Jean skinny noir — 36',                     type:'Femme',  sous_type:'Pantalon et Leggings',    description:'Jean noir stretch, taille haute. Quelques fils tirés mais imperceptibles.',            statut:'donné'  },
  { title:'Top en soie rose pâle — XS',               type:'Femme',  sous_type:'Hauts',                   description:'Top en tissu fluide, très élégant. Quelques lavages, toujours beau.',                 statut:'libre'  },
  { title:'Jupe midi vichy bleu — 40',                 type:'Femme',  sous_type:'Jupe',                    description:'Jupe mi-longue à carreaux bleus et blancs, style vintage.',                          statut:'libre'  },
  // Enfant
  { title:'Combinaison hiver bébé — 6 mois',           type:'Enfant', sous_type:'Manteaux et Vestes',      description:'Combinaison très chaude pour bébé. Portée une seule saison.',                        statut:'libre'  },
  { title:'Pack 5 T-shirts enfant — 4 ans',            type:'Enfant', sous_type:'Hauts et T-shirt',        description:'Lot de 5 T-shirts colorés taille 4 ans. En bon état général.',                       statut:'libre'  },
  // Livres
  { title:'Le Petit Prince — Antoine de Saint-Exupéry',type:'Livre',  sous_type:'Roman',                   description:'Édition illustrée, très bonne condition. Idéal pour offrir.',                        statut:'libre'  },
  { title:'Harry Potter T.1 — Poche',                  type:'Livre',  sous_type:'Roman',                   description:'Première édition de poche, quelques annotations légères au crayon.',                 statut:'libre'  },
  { title:'Astérix — Le devin',                        type:'Livre',  sous_type:'BD',                      description:'BD classique en parfait état. Couverture rigide.',                                   statut:'libre'  },
  // Autres
  { title:'Sac à dos Eastpak rouge — 25L',             type:'Autres', sous_type:'Accessoires',             description:'Sac à dos robuste, compartiments multiples. Sangles ajustables.',                    statut:'libre'  },
  { title:'Casque audio Sony — Bluetooth',             type:'Autres', sous_type:'Electroniques',           description:'Casque circum-auriculaire, excellente qualité sonore. Câble USB inclus.',             statut:'retenu' },
];

// placeholder image URLs (public domain Unsplash clothes images)
const IMG_POOL = [
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400',
  'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400',
  'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
];

const MESSAGES = [
  { content:"Bonjour ! Je suis très intéressé(e) par cet article. Est-il toujours disponible ?",             },
  { content:"Parfait ! Je peux passer le récupérer ce week-end si cela vous convient ?",                     },
  { content:"Super article, exactement ce que je cherchais. Merci beaucoup pour votre générosité !",         },
  { content:"La taille correspond-elle bien à un 42 européen ? Je veux être sûr(e) avant de me déplacer.",   },
  { content:"Je peux venir en semaine, n'importe quel soir après 18h. Dites-moi ce qui vous arrange.",       },
  { content:"Merci ! J'ai bien reçu l'article, il est parfait. Encore merci pour ce beau geste.",            },
];

// ── Seeder ─────────────────────────────────────────────
async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Create tables (if not exists)
    await sequelize.sync();

    // Clear existing data (optional)
    await Message.destroy({ where: {}, truncate: false });
    await Favorite.destroy({ where: {}, truncate: false });
    await Image.destroy({ where: {}, truncate: false });
    await Article.destroy({ where: {}, truncate: false });
    await User.destroy({ where: {}, truncate: false });
    console.log('🗑️  Existing data cleared');

    // Create users
    const pwHash = bcrypt.hashSync('Clothed123!', 10);
    const users = [];
    for (const u of USERS) {
      const user = await User.create({ ...u, password: pwHash });
      users.push(user);
    }
    console.log(`👤 Created ${users.length} users`);

    // Create articles
    let artCount = 0;
    const articles = [];
    for (let i = 0; i < ARTICLES.length; i++) {
      const owner = users[(i % (users.length - 1)) + 1]; // skip admin (index 0)
      const art = await Article.create({ ...ARTICLES[i], userId: owner.id });
      // Assign 1-2 images
      await Image.create({ path: IMG_POOL[i % IMG_POOL.length], articleId: art.id });
      if (i % 3 === 0) await Image.create({ path: IMG_POOL[(i+1) % IMG_POOL.length], articleId: art.id });
      articles.push(art);
      artCount++;
    }
    console.log(`📦 Created ${artCount} articles with images`);

    // Create favorites (each user likes 3-4 articles)
    let favCount = 0;
    for (let ui = 0; ui < users.length; ui++) {
      for (let ai = 0; ai < 3; ai++) {
        const artIdx = (ui * 3 + ai) % articles.length;
        if (articles[artIdx].userId !== users[ui].id) {
          try {
            await Favorite.create({ userId: users[ui].id, articleId: articles[artIdx].id });
            favCount++;
          } catch(e) {} // ignore duplicates
        }
      }
    }
    console.log(`❤️  Created ${favCount} favorites`);

    // Create messages
    let msgCount = 0;
    for (let i = 0; i < 12; i++) {
      const sender   = users[(i % (users.length - 1)) + 1];
      const receiver = users[(i + 2) % users.length];
      const art      = articles[i % articles.length];
      if (sender.id === receiver.id) continue;
      await Message.create({
        senderId:   sender.id,
        receiverId: receiver.id,
        content:    MESSAGES[i % MESSAGES.length].content,
        articleId:  art.id,
        isRead:     i % 3 === 0,
      });
      msgCount++;
    }
    console.log(`💬 Created ${msgCount} messages`);

    console.log('\n✅ ====================================');
    console.log('   DATABASE SEEDED SUCCESSFULLY!');
    console.log('======================================');
    console.log('\n📋 Test accounts (all passwords: Clothed123!)');
    for (const u of USERS) {
      console.log(`   ${u.isAdmin ? '👑 ADMIN' : '👤 USER '} ${u.firstName} ${u.lastName} — ${u.email}`);
    }
    console.log('\n🚀 Start the app: http://localhost:4200');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
