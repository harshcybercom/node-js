const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

const ApiUser = sequelize.define('ApiUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    is_active: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Yes, 2=No'
    }
}, {
    tableName: 'api_users',
    timestamps: true
});

module.exports = ApiUser;
