const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'Athomas17!',
    database: 'employee_db'
  },
  console.log(`Connected to the classlist_db database.`)
);


module.exports = db;
