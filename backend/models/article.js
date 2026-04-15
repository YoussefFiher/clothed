module.exports = (sequelize,DataTypes) => {
    const Article = sequelize.define('Article', {
        //clé primaire
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sous_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        statut: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });
    Article.associate = models => {
        //relation one to many avec les images => un article peut avoir plusieurs images
    Article.hasMany(models.Image, { foreignKey: 'articleId', onDelete: 'cascade' });
        //relation one to one un article et pour un seul utilisateur
    Article.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'cascade' });
    }
    

    return Article;
};

