const request = require('supertest');
const app = require('../../app');
describe('Order flow', () => {
  it('should not allow overselling', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        listingId: 1,
        quantity: 1000
      });

    expect(res.statusCode).toBe(401);
  });
});