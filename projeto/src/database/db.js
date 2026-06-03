const env = require("../config/env");

const { Pool } = require("pg");
console.log("database", env.database)
const config = {
  host: env.database.host,
  user: env.database.user,
  password: env.database.password,
  database: env.database.database,
  port: env.database.port,
};

const pool = new Pool(config);

module.exports = pool;