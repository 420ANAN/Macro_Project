const bcrypt = require('bcryptjs');
const { createPoolFromEnv } = require('../db/mysql');
require('dotenv').config();

async function createAdmin(username, fullname, email, password) {
  const pool = createPoolFromEnv();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, fullname, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [username, fullname, email, hashedPassword, 'admin', 'approved']
    );

    console.log(`✅ Admin user "${username}" created successfully!`);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error(`❌ Error: User with username/email "${username}" already exists.`);
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
  } finally {
    await pool.end();
  }
}

// Get arguments from command line
const [,, username, fullname, email, password] = process.argv;

if (!username || !fullname || !email || !password) {
  console.log('Usage: node create-admin.js <username> <fullname> <email> <password>');
  process.exit(1);
}

createAdmin(username, fullname, email, password);
