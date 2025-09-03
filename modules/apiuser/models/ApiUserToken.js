const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../../config/database');
const ApiUser = require('./ApiUser');

class ApiUserToken extends Model {}

ApiUserToken.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    token: { type: DataTypes.STRING, allowNull: false },
    revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
    expires_at: { type: DataTypes.DATE },
}, { sequelize, modelName: 'ApiUserToken', tableName: 'api_user_tokens' });

ApiUser.hasMany(ApiUserToken, { foreignKey: 'api_user_id' });
ApiUserToken.belongsTo(ApiUser, { foreignKey: 'api_user_id' });

module.exports = ApiUserToken;
