const Sequelize = require('sequelize');
const schema = require('../db');

const Task = schema.define('task', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: Sequelize.INTEGER, allowNull: false },
  project_id: { type: Sequelize.INTEGER, allowNull: false },
  category_id: { type: Sequelize.INTEGER, allowNull: false },
  title: { type: Sequelize.STRING, allowNull: false },
  completion_date: { type: Sequelize.DATE, allowNull: false },
  is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
  is_deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  created_by: Sequelize.INTEGER,
  updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updated_by: Sequelize.INTEGER,
});

module.exports = Task;