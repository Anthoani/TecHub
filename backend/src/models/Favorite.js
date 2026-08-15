const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Favorite extends Model {}

Favorite.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
  },
  { sequelize, modelName: 'Favorite', tableName: 'favorites', underscored: true }
);

module.exports = Favorite;
