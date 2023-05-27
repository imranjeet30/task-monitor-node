const env = require('./env');

const db_config = 
{
    "development": {
      "username": "root",
      "password": "",
      "database": "task_monitor_node",
      "host": "localhost",
      "port": 3306,
      "dialect": "mysql"
    },
    "production": {
      "username": "root",
      "password": "",
      "database": "task_monitor_node",
      "host": "localhost",
      "port": 3306,
      "dialect": "mysql"
    }
}

module.exports = db_config[env.name];