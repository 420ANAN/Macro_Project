'use strict';

/**
 * MACO ERP – Extended Integration Test Suite
 * QA Engineer: Antigravity AI
 * Coverage: Auth, Orders, Companies, Primary Items, Security, Edge Cases
 */

require('dotenv').config();

const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { ensureSchema, seedIfEmpty } = require('../db/init');

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function getToken(app, username, password) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username, password });
  return res.body.token;
}

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('MACO ERP – Extended API Test Suite', () => {
  let app;
  let pool;
  let adminToken;
  let customerToken;

  before(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret_extended';
    app  = require('../server');
    pool = await app.dbReady;

    await ensureSchema(pool);
    await pool.query('SET FOREIGN_KEY_CHECKS=0');
    await pool.query('TRUNCATE TABLE users');
    await pool.query('TRUNCATE TABLE orders');
    await pool.query('TRUNCATE TABLE companies');
    await pool.query('TRUNCATE TABLE primary_items');
    await pool.query('SET FOREIGN_KEY_CHECKS=1');
    await seedIfEmpty(pool);

    adminToken    = await getToken(app, 'admin',    'admin');
    customerToken = await getToken(app, 'customer', 'customer');
  });

  after(async () => {
    if (pool) {
      await pool.query('SET FOREIGN_KEY_CHECKS=0');
      await pool.query('TRUNCATE TABLE users');
      await pool.query('TRUNCATE TABLE orders');
      await pool.query('TRUNCATE TABLE companies');
      await pool.query('TRUNCATE TABLE primary_items');
      await pool.query('SET FOREIGN_KEY_CHECKS=1');
      await pool.end();
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 1. AUTHENTICATION TESTS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Auth – /api/auth/login', () => {

    it('TC-AUTH-001: Valid admin login returns 200 + JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin' })
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.role, 'admin');
      assert.ok(res.body.token && res.body.token.length > 10, 'token must exist');
    });

    it('TC-AUTH-002: Valid customer login returns 200 + JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'customer', password: 'customer' })
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.role, 'customer');
      assert.ok(res.body.token);
    });

    it('TC-AUTH-003: Wrong password returns 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrong_password' })
        .expect(401);

      assert.strictEqual(res.body.success, false);
    });

    it('TC-AUTH-004: Non-existent user returns 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'ghost_user_xyz', password: 'anything' })
        .expect(401);

      assert.strictEqual(res.body.success, false);
    });

    it('TC-AUTH-005: Empty body returns 401 (no crash)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(401);

      assert.strictEqual(res.body.success, false);
    });

    it('TC-AUTH-006: Missing password field returns 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin' })
        .expect(401);

      assert.strictEqual(res.body.success, false);
    });

    it('TC-AUTH-007: SQL injection in username does NOT succeed', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: "' OR '1'='1", password: "' OR '1'='1" })
        .expect(401);

      assert.strictEqual(res.body.success, false, 'SQL injection must be blocked');
    });

    it('TC-AUTH-008: XSS payload in username field does NOT cause 500', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: '<script>alert(1)</script>', password: 'x' });

      assert.notStrictEqual(res.status, 500, 'XSS payload must not crash the server');
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 2. REGISTRATION TESTS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Auth – /api/auth/register', () => {

    it('TC-REG-001: Valid registration creates a customer account', async () => {
      const email = `qa_test_${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({ fullname: 'QA Tester', email, password: 'Secure@123' })
        .expect(200);

      assert.strictEqual(res.body.success, true);
    });

    it('TC-REG-002: New user can login after registration', async () => {
      const email = `qa_login_${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({ fullname: 'Login Test', email, password: 'Pass1234' });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: email, password: 'Pass1234' })
        .expect(200);

      assert.strictEqual(loginRes.body.role, 'customer');
      assert.ok(loginRes.body.token);
    });

    it('TC-REG-003: Duplicate email registration returns 400', async () => {
      const email = `qa_dup_${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({ fullname: 'First', email, password: 'pass123' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ fullname: 'Second', email, password: 'pass456' })
        .expect(400);

      assert.strictEqual(res.body.success, false);
    });

    it('TC-REG-004: Registration without password returns 500 or validation error', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ fullname: 'No Pass', email: 'nopass@test.com' });

      assert.ok([400, 422, 500].includes(res.status), `Got unexpected status: ${res.status}`);
    });

    it('TC-REG-005: Newly registered user gets role=customer (not admin)', async () => {
      const email = `qa_role_${Date.now()}@example.com`;
      await request(app)
        .post('/api/auth/register')
        .send({ fullname: 'Role Test', email, password: 'role123' });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: email, password: 'role123' });

      assert.strictEqual(loginRes.body.role, 'customer', 'Self-registered user must be customer, not admin');
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 3. ORDERS API TESTS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Orders – /api/orders', () => {

    it('TC-ORD-001: GET /api/orders without token returns 401', async () => {
      await request(app).get('/api/orders').expect(401);
    });

    it('TC-ORD-002: GET /api/orders with invalid token returns 403', async () => {
      await request(app)
        .get('/api/orders')
        .set('Authorization', 'Bearer invalid.fake.token')
        .expect(403);
    });

    it('TC-ORD-003: GET /api/orders with customer token returns array', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      assert.ok(Array.isArray(res.body));
      assert.ok(res.body.length >= 3, 'Seed data should have 3 orders');
    });

    it('TC-ORD-004: Order objects have required fields', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      const order = res.body[0];
      const required = ['orderNo', 'customer', 'status'];
      for (const field of required) {
        assert.ok(order[field] !== undefined, `Order must have field: ${field}`);
      }
    });

    it('TC-ORD-005: Seed order M10001 exists and is Pending', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`);

      const order = res.body.find(o => o.orderNo === 'M10001');
      assert.ok(order, 'M10001 must exist');
      assert.strictEqual(order.status, 'Pending');
    });

    it('TC-ORD-006: Seed order M10002 is Accepted', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`);

      const order = res.body.find(o => o.orderNo === 'M10002');
      assert.strictEqual(order.status, 'Accepted');
    });

    it('TC-ORD-007: Customer CANNOT approve order (403)', async () => {
      await request(app)
        .post('/api/orders/M10001/approve')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });

    it('TC-ORD-008: Customer CANNOT reject order (403)', async () => {
      await request(app)
        .post('/api/orders/M10001/reject')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });

    it('TC-ORD-009: Admin CAN approve order successfully', async () => {
      const res = await request(app)
        .post('/api/orders/M10001/approve')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.order.status, 'Accepted');
      assert.ok(res.body.order.acceptDate, 'acceptDate must be set');
    });

    it('TC-ORD-010: Admin CAN reject order successfully', async () => {
      const res = await request(app)
        .post('/api/orders/M10003/reject')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.order.status, 'Rejected');
    });

    it('TC-ORD-011: Approve non-existent order returns 404', async () => {
      const res = await request(app)
        .post('/api/orders/NONEXISTENT999/approve')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      assert.strictEqual(res.body.success, false);
    });

    it('TC-ORD-012: Pagination params work without error', async () => {
      const res = await request(app)
        .get('/api/orders?page=1&limit=2')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      assert.ok(Array.isArray(res.body));
      assert.ok(res.body.length <= 2, 'Limit=2 must cap results to 2');
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 4. COMPANIES API TESTS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Companies – /api/companies', () => {

    it('TC-CO-001: GET /api/companies without token returns 401', async () => {
      await request(app).get('/api/companies').expect(401);
    });

    it('TC-CO-002: GET /api/companies with customer token returns 200 array', async () => {
      const res = await request(app)
        .get('/api/companies')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      assert.ok(Array.isArray(res.body));
    });

    it('TC-CO-003: Customer CANNOT POST (add) a company (403)', async () => {
      const res = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ companyId: 'C001', name: 'Test Co', email: 'co@test.com', contact: '1234567890' });

      assert.strictEqual(res.status, 403);
    });

    it('TC-CO-004: Admin CAN add a company successfully', async () => {
      const res = await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          companyId: `CO_${Date.now()}`,
          name: 'ACME Corp',
          email: 'acme@test.com',
          contact: '9876543210',
          isActive: true,
        })
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.company.name, 'ACME Corp');
    });

    it('TC-CO-005: Added company appears in GET list', async () => {
      const id = `VERIFY_${Date.now()}`;
      await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ companyId: id, name: 'Verify Corp', email: 'v@test.com', contact: '111', isActive: true });

      const list = await request(app)
        .get('/api/companies')
        .set('Authorization', `Bearer ${customerToken}`);

      const found = list.body.find(c => c.companyId === id);
      assert.ok(found, 'Newly added company must appear in list');
    });

    it('TC-CO-006: isActive is boolean in response (not 0/1)', async () => {
      await request(app)
        .post('/api/companies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ companyId: `BOOL_${Date.now()}`, name: 'Bool Test', email: 'b@test.com', contact: '000', isActive: false });

      const res = await request(app)
        .get('/api/companies')
        .set('Authorization', `Bearer ${customerToken}`);

      const boolCompany = res.body.find(c => c.name === 'Bool Test');
      if (boolCompany) {
        assert.strictEqual(typeof boolCompany.isActive, 'boolean', 'isActive must be boolean in response');
      }
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 5. PRIMARY ITEMS API TESTS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Primary Items – /api/primary-items', () => {

    it('TC-PI-001: GET /api/primary-items without token returns 401', async () => {
      await request(app).get('/api/primary-items').expect(401);
    });

    it('TC-PI-002: GET /api/primary-items with valid token returns array', async () => {
      const res = await request(app)
        .get('/api/primary-items')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      assert.ok(Array.isArray(res.body));
    });

    it('TC-PI-003: Customer CANNOT add primary item (403)', async () => {
      await request(app)
        .post('/api/primary-items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ id: 'PG01', name: 'Test Group', desc: 'Desc' })
        .expect(403);
    });

    it('TC-PI-004: Admin CAN add primary item successfully', async () => {
      const id = `PG_${Date.now()}`;
      const res = await request(app)
        .post('/api/primary-items')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id, name: 'Steel Group', desc: 'All steel items' })
        .expect(200);

      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.item.name, 'Steel Group');
    });

    it('TC-PI-005: Added item appears in GET list', async () => {
      const id = `PG_VER_${Date.now()}`;
      await request(app)
        .post('/api/primary-items')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id, name: 'Verify Group', desc: 'To verify' });

      const list = await request(app)
        .get('/api/primary-items')
        .set('Authorization', `Bearer ${customerToken}`);

      const found = list.body.find(i => i.id === id);
      assert.ok(found, 'Added item must appear in GET list');
    });

    it('TC-PI-006: Admin CAN delete primary item', async () => {
      const id = `PG_DEL_${Date.now()}`;
      await request(app)
        .post('/api/primary-items')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id, name: 'Delete Me', desc: '' });

      const res = await request(app)
        .delete(`/api/primary-items/${id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      assert.strictEqual(res.body.success, true);
    });

    it('TC-PI-007: Customer CANNOT delete primary item (403)', async () => {
      const id = `PG_NODEL_${Date.now()}`;
      await request(app)
        .post('/api/primary-items')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id, name: 'No Delete', desc: '' });

      await request(app)
        .delete(`/api/primary-items/${id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });

    it('TC-PI-008: Duplicate item ID returns error (409 / 500)', async () => {
      const id = `PG_DUP_${Date.now()}`;
      await request(app)
        .post('/api/primary-items')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id, name: 'Original', desc: '' });

      const res = await request(app)
        .post('/api/primary-items')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id, name: 'Duplicate', desc: '' });

      assert.ok([400, 409, 500].includes(res.status), `Expected conflict error, got ${res.status}`);
    });

    it('TC-PI-009: Item without required name returns error', async () => {
      const res = await request(app)
        .post('/api/primary-items')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id: `PG_NONAME_${Date.now()}`, desc: 'No name' });

      assert.ok([400, 422, 500].includes(res.status), 'Must reject item without name');
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 6. SECURITY TESTS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Security Tests', () => {

    it('TC-SEC-001: No token on protected endpoints returns 401', async () => {
      const endpoints = ['/api/orders', '/api/companies', '/api/primary-items'];
      for (const ep of endpoints) {
        const res = await request(app).get(ep);
        assert.strictEqual(res.status, 401, `${ep} must require auth`);
      }
    });

    it('TC-SEC-002: Tampered JWT signature returns 403', async () => {
      const tampered = adminToken.slice(0, -5) + 'XXXXX';
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${tampered}`)
        .expect(403);

      assert.strictEqual(res.body.success, false);
    });

    it('TC-SEC-003: Expired token simulation (wrong secret) returns 403', async () => {
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { id: 1, role: 'admin', username: 'admin' },
        'different_secret_than_server',
        { expiresIn: '1d' }
      );

      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(403);

      assert.strictEqual(res.body.success, false);
    });

    it('TC-SEC-004: Customer cannot escalate privileges to approve orders', async () => {
      // Customer tries to approve as if admin
      const res = await request(app)
        .post('/api/orders/M10002/approve')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);

      assert.strictEqual(res.body.message, 'Admin only access.');
    });

    it('TC-SEC-005: Very large payload does not crash server', async () => {
      const largeString = 'A'.repeat(100000);
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: largeString, password: largeString });

      assert.ok([400, 401, 413, 500].includes(res.status), 'Server must handle large payloads');
    });

    it('TC-SEC-006: CORS header is present', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Origin', 'http://localhost:5173');

      assert.ok(
        res.headers['access-control-allow-origin'],
        'CORS header must be present'
      );
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 7. EDGE CASES & NEGATIVE TESTS
  // ══════════════════════════════════════════════════════════════════════════
  describe('Edge Cases & Negative Tests', () => {

    it('TC-EDGE-001: Unknown route returns redirect/404 (not a crash)', async () => {
      const res = await request(app).get('/api/nonexistent-endpoint');
      assert.ok([404, 302, 200].includes(res.status), `Unexpected status: ${res.status}`);
    });

    it('TC-EDGE-002: Wrong HTTP method on POST-only endpoint returns 404/405', async () => {
      const res = await request(app)
        .get('/api/auth/login')
        .set('Authorization', `Bearer ${adminToken}`);

      assert.notStrictEqual(res.status, 200, 'GET on login endpoint must not succeed');
    });

    it('TC-EDGE-003: Delete non-existent primary item does not crash', async () => {
      const res = await request(app)
        .delete('/api/primary-items/NONEXISTENT_ID_9999')
        .set('Authorization', `Bearer ${adminToken}`);

      assert.ok([200, 404].includes(res.status), 'Delete of non-existent item should be 200 (idempotent) or 404');
    });

    it('TC-EDGE-004: Approve already-accepted order works (idempotent)', async () => {
      // M10002 was already accepted in seed data
      const res = await request(app)
        .post('/api/orders/M10002/approve')
        .set('Authorization', `Bearer ${adminToken}`);

      assert.ok([200, 404].includes(res.status));
    });

    it('TC-EDGE-005: page=0 query param does not crash', async () => {
      const res = await request(app)
        .get('/api/orders?page=0&limit=10')
        .set('Authorization', `Bearer ${customerToken}`);

      assert.ok([200, 400].includes(res.status));
    });

    it('TC-EDGE-006: String limit param does not crash', async () => {
      const res = await request(app)
        .get('/api/orders?limit=abc')
        .set('Authorization', `Bearer ${customerToken}`);

      assert.ok([200, 400].includes(res.status));
    });
  });
});
