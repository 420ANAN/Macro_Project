require('dotenv').config();
const { createPoolFromEnv } = require('./mysql');

async function migrate() {
  const pool = createPoolFromEnv();
  console.log('Starting migration...');
  try {
    // Add userId to leads if not exists
    await pool.query(`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS userId BIGINT UNSIGNED NULL,
      ADD CONSTRAINT IF NOT EXISTS fk_leads_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    `).catch(e => console.log('leads migration note:', e.message));

    // Update leads status enum
    await pool.query(`
      ALTER TABLE leads 
      MODIFY COLUMN status ENUM('New', 'Contacted', 'Qualified', 'Lost', 'Converted') NOT NULL DEFAULT 'New'
    `).catch(e => console.log('leads status migration note:', e.message));

    // Add userId to deals if not exists
    await pool.query(`
      ALTER TABLE deals 
      ADD COLUMN IF NOT EXISTS userId BIGINT UNSIGNED NULL,
      ADD CONSTRAINT IF NOT EXISTS fk_deals_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
    `).catch(e => console.log('deals migration note:', e.message));

    // Ensure users role is ENUM and long enough
    await pool.query(`
      ALTER TABLE users 
      MODIFY COLUMN role ENUM('admin','customer') NOT NULL
    `).catch(e => console.log('users role migration note:', e.message));

    console.log('Migration finished.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
