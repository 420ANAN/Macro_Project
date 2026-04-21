
const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateSchema() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  console.log('Updating schema...');

  try {
    // Add userId to leads if not exists
    const [columns] = await connection.query('DESCRIBE leads');
    const hasUserId = columns.some(c => c.Field === 'userId');
    if (!hasUserId) {
      await connection.query('ALTER TABLE leads ADD COLUMN userId BIGINT UNSIGNED NULL');
      await connection.query('ALTER TABLE leads ADD CONSTRAINT fk_leads_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL');
      console.log('Added userId to leads.');
    }

    // Update status enum
    await connection.query("ALTER TABLE leads MODIFY COLUMN status ENUM('New', 'Contacted', 'Qualified', 'Lost', 'Converted') NOT NULL DEFAULT 'New'");
    console.log('Updated leads status enum.');

    // Check orders table for userId
    const [orderColumns] = await connection.query('DESCRIBE orders');
    const hasOrderUserId = orderColumns.some(c => c.Field === 'userId');
    if (!hasOrderUserId) {
      await connection.query('ALTER TABLE orders ADD COLUMN userId BIGINT UNSIGNED NULL');
      await connection.query('ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL');
      console.log('Added userId to orders.');
    }

    // Check deals for userId
    const [dealColumns] = await connection.query('DESCRIBE deals');
    const hasDealUserId = dealColumns.some(c => c.Field === 'userId');
    if (!hasDealUserId) {
        await connection.query('ALTER TABLE deals ADD COLUMN userId BIGINT UNSIGNED NULL');
        await connection.query('ALTER TABLE deals ADD CONSTRAINT fk_deals_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL');
        console.log('Added userId to deals.');
    }

  } catch (err) {
    console.error('Error during schema update:', err);
  } finally {
    await connection.end();
  }
}

updateSchema();
