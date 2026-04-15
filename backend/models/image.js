module.exports = (sequelize,DataTypes) => {
    const Image = sequelize.define('Image', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        path: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    });

    Image.associate = models => {
        Image.belongsTo(models.Article, { foreignKey: 'articleId', onDelete: 'cascade' });
    }

    return Image;
};