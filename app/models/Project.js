const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const schema = require('../db');

const Project = schema.define('project', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  team_id: { type: Sequelize.INTEGER, allowNull: false },
  name: { type: Sequelize.INTEGER, allowNull: false },
  url: { type: Sequelize.INTEGER, allowNull: false },
  is_active: { type: Sequelize.BOOLEAN,defaultValue:true },
  is_deleted: { type: Sequelize.BOOLEAN },
  created_at: { type: Sequelize.DATE },
  created_by: { type:Sequelize.INTEGER},
  updated_at: { type: Sequelize.DATE },
  updated_by: {type:Sequelize.INTEGER}
});

module.exports = { Project, Op };