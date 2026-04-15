module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //email doit etre unique
            unique: true 
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pdp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        confirmcode :{
            type: DataTypes.STRING,
            allowNull: true,
        },
        isConfirmed : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        forgotPassword:{
            type : DataTypes.STRING,
            allowNull: true
        }
    });
    User.associate = models => {
        //un utilisateur peut avoir plusieurs articles 
        User.hasMany(models.Article, { foreignKey: 'userId', onDelete: 'cascade' });
    }

    return User;
};

