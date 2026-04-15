export {};
const express = require('express');
const db = require('../models')
const cors = require('cors')
const articleRouter = express.Router();

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:4200"],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-methods'],
};

articleRouter.use(cors(corsOptions));


//Route pour rajouter un nouvel article dans la BD 
articleRouter.post('/addarticle', async (req:any, res:any) => {
    try {
        //recupération des données de l'utilisateur actuel et les données de l'article 
        const currentUser = req.body.user;
        const { title, type,sous_type, description, images } = req.body;

        //creation d'un nouvel article dans la BD
        const newArticle = await db.Article.create({
            title,
            type,
            sous_type,
            description,
            statut: 'libre', //statut initial de l'article
            userId: currentUser.id,//id de l'utilisateur créant l'article
        });
        //verification s'il ya des images assosiés a l'article
        if (images && images.length > 0) {
            // Création des images associées à l'article
            const imagePromises = images.map(async (imageData: any) => {
                const newImage = await db.Image.create({
                    path: imageData.path,
                    articleId: newArticle.id,
                });

                return newImage;
            });

            const createdImages = await Promise.all(imagePromises);

            console.log('Nouvel article ajouté avec des images associées:', newArticle);
            res.json({ success: true, article: newArticle, images: createdImages });
        } else {
            //en cas d'absence d'image
            console.error('Veuillez sélectionner au moins une image.');
            res.status(400).json({ success: false, message: 'Veuillez sélectionner au moins une image.' });
        }
    } catch (error) {
        //gestion d'erreurs lors de l'ajout de l'article
        console.error('Erreur lors de l\'ajout de l\'article:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout de l\'article' });
    }
});

//Route pour changer le statut de l'article si l'article est donné 
articleRouter.post('/updateArticleStatus/:articleId', async (req: any, res: any) => {
    try {
        const articleId = req.params.articleId;
        const newStatus = req.body.newStatus;

        if (!articleId || !newStatus) {
            return res.status(400).json({ success: false, message: 'L\'ID de l\'article et le nouveau statut sont requis.' });
        }

        const updatedArticle = await db.Article.update(
            { statut: newStatus },
            { where: { id: articleId } }
        );

        if (updatedArticle[0] === 0) {
            return res.status(404).json({ success: false, message: 'Article non trouvé.' });
        }

        res.status(200).json({ success: true, message: 'Statut de l\'article mis à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de l\'article:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du statut de l\'article.' });
    }
});

//route pour recuperer tous les articles
articleRouter.get('/', async (req: any, res: any) => {
    try {
        const articles = await db.Article.findAll({
            include: [{
                model: db.Image,
                attributes: ['path']
            },
        {
            model: db.User, 
            attributes: ['id', 'firstName', 'lastName', 'email','city','address']
        }]
        });

        const formattedArticles = articles.map((article: any) => ({
            id: article.id,
            images: article.Images.map((image: any) => image.path),
            title: article.title,
            type: article.type,
            sous_type : article.sous_type,
            description: article.description,
            statut: article.statut,
            user: {
                id: article.User.id,
                firstName: article.User.firstName,
                lastName: article.User.lastName,
                email: article.User.email,
                city : article.User.city,
                address : article.User.address
            }
            
        }));

        res.status(200).json(formattedArticles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des articles' });
    }
});

//route pour recuperer l'article par son identifiant 
articleRouter.get('/:id', async (req: any, res: any) => {
    try {
        const articleId = req.params.id;
        const article = await db.Article.findOne({
            where: { id: articleId },
            include: [{
                model: db.Image,
                attributes: ['path']
            }, {
                model: db.User,  
                attributes: ['id', 'firstName', 'lastName', 'email','city','address']  
            }]
        });

        if (article) {
            const formattedArticle = {
                id: article.id,
                images: article.Images.map((image: any) => image.path),
                title: article.title,
                type: article.type,
                description: article.description,
                statut: article.statut,
                user: {
                    id: article.User.id,
                    firstName: article.User.firstName,
                    lastName: article.User.lastName,
                    email: article.User.email,
                    city : article.User.city,
                    address : article.User.address
                }
            };

            res.status(200).json(formattedArticle);
        } else {
            res.status(404).json({ success: false, message: 'Article non trouvé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'article par ID' });
    }
});


// route pour recuperer les article de chaque utilisateur
articleRouter.get('/user/:userId', async (req: any, res: any) => {
    try {
        const userId = req.params.userId;
        const articles = await db.Article.findAll({
            where: { userId: userId },
            include: [{
                model: db.Image,
                attributes: ['path']
            }, {
                model: db.User,
                attributes: ['id', 'firstName', 'lastName', 'email', 'city', 'address']
            }]
        });

        const formattedArticles = articles.map((article: any) => ({
            id: article.id,
            images: article.Images.map((image: any) => image.path),
            title: article.title,
            type: article.type,
            description: article.description,
            statut: article.statut,
            user: {
                id: article.User.id,
                firstName: article.User.firstName,
                lastName: article.User.lastName,
                email: article.User.email,
                city: article.User.city,
                address: article.User.address
            }
        }));

        res.status(200).json(formattedArticles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des articles par utilisateur' });
    }
});

// route pour supprimer un article 
articleRouter.post('/delete-article/:id', async (req: any, res: any) => {
    try {
      const articleId = req.params.id;
  
      const article = await db.Article.findByPk(articleId);
  
      if (article) {
        await article.destroy();
        res.status(200).json({ success: true, message: 'Article supprimé avec succès' });

        
      } else {
        res.status(404).json({ success: false, message: 'Article non trouvé' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l\'article' });
    }
});

module.exports  = articleRouter;