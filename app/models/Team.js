const Sequelize = require('sequelize');
const schema = require('../db');

const Team = schema.define('team', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  team_leader_id: { type: Sequelize.INTEGER, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  is_active: { type: Sequelize.INTEGER, allowNull: false },
  is_deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  created_by: Sequelize.INTEGER,
  updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updated_by: Sequelize.INTEGER,
});

module.exports = Team;