const request = require('supertest');
const app = require('../server');

describe('Macro ERP Integration Tests', () => {
    let token;

    beforeAll(async () => {
        // Login as admin to get token
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'admin' });
        token = res.body.token;
    });

    describe('Auth API', () => {
        it('should fail with 401 for invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'admin', password: 'wrongpassword' });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should register a new user', async () => {
            const email = `jest_test_${Date.now()}@test.com`;
            const res = await request(app)
                .post('/api/auth/register')
                .send({ fullname: 'Jest User', email, password: 'password123' });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Orders API', () => {
        it('should fetch orders when authenticated', async () => {
            const res = await request(app)
                .get('/api/orders')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return 401 when no token is provided', async () => {
            const res = await request(app).get('/api/orders');
            expect(res.statusCode).toBe(401);
        });

        it('should fail to approve order with customer token', async () => {
            // First, login as a customer
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ username: 'customer', password: 'customer' });
            const customerToken = loginRes.body.token;

            const res = await request(app)
                .post('/api/orders/M10001/approve')
                .set('Authorization', `Bearer ${customerToken}`);
            expect(res.statusCode).toBe(403);
        });
    });

    describe('Security Tests', () => {
        it('should reject tampered tokens', async () => {
            const tamperedToken = token + 'manipulated';
            const res = await request(app)
                .get('/api/orders')
                .set('Authorization', `Bearer ${tamperedToken}`);
            expect(res.statusCode).toBe(403);
        });
    });
});
