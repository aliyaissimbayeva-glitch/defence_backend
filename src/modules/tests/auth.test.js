const request = require('supertest');
const app = require('../../app');
describe('Auth protection', () => {
  it('should block access without token', async () => {
    const res = await request(app).get('/listings');

    expect(res.statusCode).toBe(401);
  });
});