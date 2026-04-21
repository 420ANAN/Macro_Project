CREATE TABLE IF NOT EXISTS product_categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cat_name (name)
);

CREATE TABLE IF NOT EXISTS item_units (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS item_sizes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  itemCode VARCHAR(50) UNIQUE NULL,
  name VARCHAR(255) NOT NULL,
  category_id INT UNSIGNED NULL,
  description TEXT NULL,
  uom VARCHAR(32) DEFAULT 'PCS',
  rate DECIMAL(15,2) DEFAULT 0.00,
  mrp DECIMAL(15,2) DEFAULT 0.00,
  image_url VARCHAR(512) NULL,
  supplier_name VARCHAR(255) NULL,
  location VARCHAR(255) NULL,
  experience_years INT DEFAULT 0,
  phone VARCHAR(64) NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  fullname VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','customer') NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'approved', -- NEW: approval-based access
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                             -- NEW: registration timestamp
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username)
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  orderNo VARCHAR(64) NOT NULL,
  userId BIGINT UNSIGNED NULL,
  customer VARCHAR(255) NOT NULL,
  requisition VARCHAR(255) NULL,
  poDate VARCHAR(64) NULL,
  destination VARCHAR(255) NULL,
  amount VARCHAR(64) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Pending',
  acceptDate VARCHAR(64) NULL,
  pdf VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_orderNo (orderNo),
  INDEX idx_orders_status (status),
  CONSTRAINT fk_orders_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- NEW: Supply & Challan Tracking
CREATE TABLE IF NOT EXISTS supply_challans (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  challanNo VARCHAR(50) UNIQUE NOT NULL,
  companyId VARCHAR(50) NOT NULL,
  challanDate DATE NOT NULL,
  uploadedBy BIGINT UNSIGNED,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supply_details (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  challanNo VARCHAR(50) NOT NULL,
  itemName VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  uom VARCHAR(20),
  FOREIGN KEY (challanNo) REFERENCES supply_challans(challanNo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS companies (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  companyId VARCHAR(64) NULL,
  name VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  contact VARCHAR(64) NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  INDEX idx_companies_active (isActive)
);

CREATE TABLE IF NOT EXISTS primary_items (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  item_desc TEXT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  orderNo VARCHAR(64) NOT NULL,
  productId BIGINT UNSIGNED NULL,
  itemName VARCHAR(255) NOT NULL,
  size VARCHAR(32) NULL,
  quantity INT NOT NULL,
  price VARCHAR(64) NULL,
  uom VARCHAR(32) NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (orderNo) REFERENCES orders(orderNo) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
);

-- CRM Modules
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(64) NULL,
  status ENUM('New', 'Contacted', 'Qualified', 'Lost', 'Converted') NOT NULL DEFAULT 'New',
  companyId BIGINT UNSIGNED NULL,
  userId BIGINT UNSIGNED NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_leads_company FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE SET NULL,
  CONSTRAINT fk_leads_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS deals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) DEFAULT 0.00,
  stage ENUM('Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost') NOT NULL DEFAULT 'Discovery',
  leadId BIGINT UNSIGNED NULL,
  userId BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_deals_lead FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE,
  CONSTRAINT fk_deals_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  dueDate DATE NULL,
  status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
  userId BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_tasks_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

