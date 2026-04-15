module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
        senderId: { type: DataTypes.INTEGER, allowNull: false },
        receiverId: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        articleId: { type: DataTypes.INTEGER, allowNull: true },
        isRead: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    });

    Message.associate = models => {
        Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
        Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
        Message.belongsTo(models.Article, { foreignKey: 'articleId', as: 'article' });
    };

    return Message;
};
