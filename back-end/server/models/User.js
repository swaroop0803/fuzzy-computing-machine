const db = require('../config/db');

class User {
  // Method to find a user by email by calling a stored procedure
  static async findByEmail(email) {
    const sql = 'CALL GetUserByEmail(?)';
    
    // The result from a stored procedure is often nested in an extra array
    const [resultSets] = await db.query(sql, [email]);
    
    // Return the actual user data from the first element of the result set
    return resultSets[0][0]; 
  }

  // Method to create a new user by calling a stored procedure
  static async create(username, email, hashedPassword) {
    const sql = `CALL RegisterUser(?, ?, ?)`;
    
    const [resultSets] = await db.query(sql, [username, email, hashedPassword]);
    
    // Return the result from the procedure (e.g., the new user's ID and username)
    return resultSets[0][0];
  }
}

module.exports = User;
