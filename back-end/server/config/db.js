// const mysql = require('mysql2');
// require('dotenv').config();

// // Create a connection pool for better performance and resource management
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Use the promise-based version of the pool to allow for async/await
// module.exports = pool.promise();

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");
require("dotenv").config();

// Optional: If you want to enable SSL later, keep this path ready
const caPath = path.resolve(__dirname, "../ca.pem");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "testdb",
  port: process.env.DB_PORT || 3306,

  // ✅ Temporary fix for local SSL error
  ssl: {
    rejectUnauthorized: false, // Ignore SSL verification
    // ca: fs.readFileSync(caPath), // ← uncomment this later if needed
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to MySQL database:", err);
  } else {
    console.log("✅ Successfully connected to MySQL database");
    connection.release();
  }
});

// Use the promise-based version of the pool for async/await
module.exports = pool.promise();
