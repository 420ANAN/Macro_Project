'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const { createPoolFromEnv } = require('./mysql');

async function ensureColumns(pool) {
  // Check if status and createdAt columns exist in users table
  const [columns] = await pool.query('SHOW COLUMNS FROM users');
  const hasStatus = columns.some(c => c.Field === 'status');
  const hasCreatedAt = columns.some(c => c.Field === 'createdAt');

  if (!hasStatus) {
    console.log('Adding "status" column to users table...');
    await pool.query("ALTER TABLE users ADD COLUMN status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved'");
  }
  if (!hasCreatedAt) {
    console.log('Adding "createdAt" column to users table...');
    await pool.query("ALTER TABLE users ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
  }

  const [prodColumns] = await pool.query('SHOW COLUMNS FROM products');
  const hasItemCode = prodColumns.some(c => c.Field === 'itemCode');
  const hasMrp = prodColumns.some(c => c.Field === 'mrp');

  if (!hasItemCode) {
    console.log('Adding "itemCode" column to products table...');
    await pool.query("ALTER TABLE products ADD COLUMN itemCode VARCHAR(50) UNIQUE NULL");
  }
  if (!hasMrp) {
    console.log('Adding "mrp" column to products table...');
    await pool.query("ALTER TABLE products ADD COLUMN mrp DECIMAL(15,2) DEFAULT 0.00");
  }

  const hasSupplier = prodColumns.some(c => c.Field === 'supplier_name');
  if (!hasSupplier) {
    console.log('Adding B2B columns to products table...');
    await pool.query("ALTER TABLE products ADD COLUMN supplier_name VARCHAR(255) NULL");
    await pool.query("ALTER TABLE products ADD COLUMN location VARCHAR(255) NULL");
    await pool.query("ALTER TABLE products ADD COLUMN experience_years INT DEFAULT 0");
    await pool.query("ALTER TABLE products ADD COLUMN phone VARCHAR(64) NULL");
  }

  const [orderColumns] = await pool.query('SHOW COLUMNS FROM orders');
  const hasPaymentStatus = orderColumns.some(c => c.Field === 'paymentStatus');
  const hasTrackingNo = orderColumns.some(c => c.Field === 'trackingNo');

  if (!hasPaymentStatus) {
    console.log('Adding "paymentStatus" column to orders table...');
    await pool.query("ALTER TABLE orders ADD COLUMN paymentStatus VARCHAR(50) DEFAULT 'Unpaid'");
  }
  if (!hasTrackingNo) {
    console.log('Adding "trackingNo" column to orders table...');
    await pool.query("ALTER TABLE orders ADD COLUMN trackingNo VARCHAR(100) NULL");
  }
}

async function ensureSchema(pool) {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = await fs.readFile(schemaPath, 'utf8');
  await pool.query(sql);
  await ensureColumns(pool);
}

async function seedIfEmpty(pool) {
    const [[{ c: userCount }]] = await pool.query('SELECT COUNT(*) AS c FROM users');
  if (userCount === 0) {
    const hashedAdminPassword = await bcrypt.hash('admin', 10);
    const hashedCustomerPassword = await bcrypt.hash('customer', 10);
    
    // CHANGED: added status='approved' for seeded users
    await pool.execute(
      'INSERT INTO users (username, fullname, email, password_hash, role, status) VALUES (?,?,?,?,?,?)',
      ['admin', 'Admin User', 'admin@maco.com', hashedAdminPassword, 'admin', 'approved']
    );
    await pool.execute(
      'INSERT INTO users (username, fullname, email, password_hash, role, status) VALUES (?,?,?,?,?,?)',
      ['customer', 'Customer User', 'customer@maco.com', hashedCustomerPassword, 'customer', 'approved']
    );

    const categories = [
      'Clutch Assembly', 'Pressure Plate', 'Engine Valves', 'Clutch Plates',
      'Piston Pins', 'Crank Shafts', 'Crank Pins', 'Connecting Rod Kits',
      'Brake Pads', 'Brake Shoes', 'Brake Shoes 2nd'
    ];

    const [[{ c: catCount }]] = await pool.query('SELECT COUNT(*) AS c FROM product_categories');
    if (catCount === 0) {
      for (const cat of categories) {
        await pool.execute('INSERT INTO product_categories (name) VALUES (?)', [cat]);
      }
    }

    const [[{ c: prodCount }]] = await pool.query('SELECT COUNT(*) AS c FROM products');
    if (prodCount === 0) {
      await pool.execute(
        'INSERT INTO products (name, category_id, description, uom, rate, image_url, supplier_name, location, experience_years, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ['Heavy Duty Clutch Plate', 4, 'High performance clutch plate\nPrecision Engineered\nLong Life Durability', 'PCS', 1250.00, 'https://picsum.photos/400/300?1', 'Maco Automotive Pvt Ltd', 'New Delhi, India', 15, '9876543210']
      );
      await pool.execute(
        'INSERT INTO products (name, category_id, description, uom, rate, image_url, supplier_name, location, experience_years, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ['Premium Engine Valve', 3, 'Heat-treated engine valves\nSuperior Heat Resistance\nOEM Quality Standard', 'SET', 450.00, 'https://picsum.photos/400/300?2', 'Auto Spare Parts Corp', 'Gurgaon, Haryana', 10, '9123456789']
      );
    }
  }

  const [[{ c: companyCount }]] = await pool.query('SELECT COUNT(*) AS c FROM companies');
  if (companyCount === 0) {
    await pool.execute(
      'INSERT INTO companies (companyId, name, email, contact, isActive) VALUES (?,?,?,?,?)',
      ['CO1001', 'Self Trading Company', 'info@selftrading.com', '9876543210', 1]
    );
  }

  const [[{ c: leadCount }]] = await pool.query('SELECT COUNT(*) AS c FROM leads');
  if (leadCount === 0) {
    await pool.execute(
      'INSERT INTO leads (name, email, phone, status, companyId, userId) VALUES (?,?,?,?,?,?)',
      ['John Doe', 'john@example.com', '1234567890', 'New', 1, 1]
    );
  }

  const [[{ c: orderCount }]] = await pool.query('SELECT COUNT(*) AS c FROM orders');
  if (orderCount === 0) {
    await pool.execute(
      'INSERT INTO orders (orderNo, userId, customer, requisition, poDate, destination, amount, status, acceptDate, pdf) VALUES ' +
        '(?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?)',
      [
        'M10001',
        1,
        'SELF TRADING COMPANY',
        '123',
        '26-02-2014',
        'Sonipat',
        '847500',
        'Pending',
        '',
        'PDF',
        'M10002',
        1,
        'SELF TRADING COMPANY',
        '124',
        '26-02-2014',
        'Sonipat',
        '548600',
        'Accepted',
        '27-02-2014',
        'PDF',
        'M10003',
        1,
        'SELF TRADING COMPANY',
        '125',
        '26-02-2014',
        'Sonipat',
        '155850',
        'Rejected',
        '27-02-2014',
        'PDF',
      ]
    );
  }
}

async function initDb() {
  const pool = createPoolFromEnv();
  await ensureSchema(pool);
  await seedIfEmpty(pool);
  return pool;
}

module.exports = { initDb, ensureSchema, seedIfEmpty };

