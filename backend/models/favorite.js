// models/favorite.js

module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      //le champ des articles
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      //le champ des utilisateurs
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    Favorite.associate = models => {
      // Relation many-to-one avec l'utilisateur
      Favorite.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'cascade' });
  
      // Relation many-to-many avec l'article
      Favorite.belongsToMany(models.Article, { through: 'FavoriteArticle', onDelete: 'cascade' });
    };
  
    return Favorite;
  };
  