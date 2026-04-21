'use strict';

const mysql = require('mysql2/promise');

function envInt(name, fallback) {
  const v = process.env[name];
  if (v == null || v === '') return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function createPoolFromEnv() {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  const port = envInt('MYSQL_PORT', 3306);

  if (!host || !user || !database) {
    throw new Error(
      'Missing MySQL env vars. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE (and optionally MYSQL_PORT, MYSQL_SSL).'
    );
  }

  const sslEnabled = process.env.MYSQL_SSL === '1' || process.env.MYSQL_SSL === 'true';
  const ssl =
    sslEnabled
      ? {
          // For many managed providers, CA verification requires providing a CA bundle.
          // Defaulting to rejectUnauthorized=false keeps setup simple; harden later with proper CA.
          rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED === '1',
        }
      : undefined;

  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: envInt('MYSQL_POOL_SIZE', 10),
    queueLimit: 0,
    multipleStatements: true,
    ssl,
  });
}

module.exports = { createPoolFromEnv };

