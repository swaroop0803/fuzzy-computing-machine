// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const db = require('./config/db');
// // UPDATED: Change this line to point to the new file
// const authRoutes = require('./routes/auth');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// app.use('/api/auth', authRoutes);

// db.getConnection()
//   .then(connection => {
//     console.log('✅ Successfully connected to MySQL database.');
//     connection.release();
//     app.listen(PORT, () => {
//       console.log(`🚀 Server is running on port: ${PORT}`);
//     });
//   })
//   .catch(error => {
//     console.error('❌ Error connecting to MySQL database:', error);
//     process.exit(1);
//   });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Import your route handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); // This line needs the file to exist

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // This tells Express to use your user routes

// Root URL for testing
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});

// Connect to Database and Start Server
db.getConnection()
  .then(connection => {
    console.log('✅ Successfully connected to MySQL database.');
    connection.release();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Error connecting to MySQL database:', error);
    process.exit(1);
  });


