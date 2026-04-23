require('dotenv').config();
const { createPoolFromEnv } = require('./db/mysql');

async function migrate() {
  const pool = createPoolFromEnv();
  console.log('Starting minimal database migration...');

  try {
    // 1. Add stock to products
    const [prodCols] = await pool.query('SHOW COLUMNS FROM products');
    if (!prodCols.some(c => c.Field === 'stock')) {
      console.log('Adding "stock" to products...');
      await pool.query('ALTER TABLE products ADD COLUMN stock INT DEFAULT 0');
    }

    // 2. Add paymentStatus and trackingNo to orders
    const [orderCols] = await pool.query('SHOW COLUMNS FROM orders');
    if (!orderCols.some(c => c.Field === 'paymentStatus')) {
      console.log('Adding "paymentStatus" to orders...');
      await pool.query("ALTER TABLE orders ADD COLUMN paymentStatus ENUM('Unpaid', 'Paid', 'Refunded') DEFAULT 'Unpaid'");
    }
    if (!orderCols.some(c => c.Field === 'trackingNo')) {
      console.log('Adding "trackingNo" to orders...');
      await pool.query('ALTER TABLE orders ADD COLUMN trackingNo VARCHAR(100) NULL');
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
