// models/ApiToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const User = require('./User');

const ApiToken = sequelize.define('ApiToken', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  expires_at: { type: DataTypes.DATE },
  revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'api_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false // we don’t need updated_at for tokens
});

// associations
User.hasMany(ApiToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ApiToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = ApiToken;
