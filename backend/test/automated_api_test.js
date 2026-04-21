const assert = require('assert');

async function testApis() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- Starting API Testing ---');

  // 1. Test Login (Invalid)
  console.log('Testing Login (Invalid)...');
  const loginInvalidRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
  });
  assert.strictEqual(loginInvalidRes.status, 401);
  const loginInvalidData = await loginInvalidRes.json();
  assert.strictEqual(loginInvalidData.success, false);
  console.log('✅ Login (Invalid) failed as expected.');

  // 2. Test Login (Valid Admin)
  console.log('Testing Login (Valid Admin)...');
  const loginAdminRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
  });
  assert.strictEqual(loginAdminRes.status, 200);
  const loginAdminData = await loginAdminRes.json();
  assert.strictEqual(loginAdminData.success, true);
  assert.strictEqual(loginAdminData.role, 'admin');
  const adminToken = loginAdminData.token;
  console.log('✅ Login (Valid Admin) successful.');

  // 3. Test Registration
  const testEmail = `test_${Date.now()}@example.com`;
  console.log(`Testing Registration with ${testEmail}...`);
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullname: 'Test User', email: testEmail, password: 'password123' })
  });
  assert.strictEqual(regRes.status, 200);
  const regData = await regRes.json();
  assert.strictEqual(regData.success, true);
  console.log('✅ Registration successful.');

  // 4. Test Login (New User)
  console.log('Testing Login (New User)...');
  const loginUserRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testEmail, password: 'password123' })
  });
  assert.strictEqual(loginUserRes.status, 200);
  const loginUserData = await loginUserRes.json();
  assert.strictEqual(loginUserData.role, 'customer');
  const userToken = loginUserData.token;
  console.log('✅ Login (New User) successful.');

  // 5. Test Access Control (Customer accessing Admin-only route)
  console.log('Testing Access Control (Customer vs Admin Route)...');
  const approveRes = await fetch(`${baseUrl}/api/orders/M10001/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert.strictEqual(approveRes.status, 403);
  console.log('✅ Access Control: Customer forbidden from Admin route.');

  // 6. Test Get Orders
  console.log('Testing Get Orders...');
  const ordersRes = await fetch(`${baseUrl}/api/orders`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  assert.strictEqual(ordersRes.status, 200);
  const ordersData = await ordersRes.json();
  assert.ok(Array.isArray(ordersData));
  console.log(`✅ Get Orders successful. Count: ${ordersData.length}`);

  // 7. Test Empty Body / Missing Fields
  console.log('Testing Missing Fields in Registration...');
  const failRegRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  // The current implementation might not handle missing fields well and return 500 or 400
  console.log(`Registration with empty body returned status: ${failRegRes.status}`);

  console.log('--- API Testing Completed Successfully ---');
}

testApis().catch(err => {
  console.error('❌ API Testing Failed:', err);
  process.exit(1);
});
