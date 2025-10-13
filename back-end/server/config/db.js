const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool for better performance and resource management
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Use the promise-based version of the pool to allow for async/await
module.exports = pool.promise();


