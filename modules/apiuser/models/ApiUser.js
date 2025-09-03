const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');

class ApiUser extends Model {}

ApiUser.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'ApiUser', tableName: 'api_users' });

module.exports = ApiUser;
