const request = require('supertest');
const app = require('./server');

describe('GET /', () => {
  it('should return the welcome page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Welcome to iximiuz Labs!');
  });
});

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/info', () => {
  it('should return app info', async () => {
    const res = await request(app).get('/api/info');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('my-app');
    expect(res.body.version).toBe('1.0.0');
    expect(res.body.node).toBeDefined();
  });
});
