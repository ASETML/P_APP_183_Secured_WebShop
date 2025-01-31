const mysql = require("mysql2");
const db = mysql.createConnection({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
  database: process.env.DBDATABASE,
});

module.exports = db;
