import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/server/app.js';

describe('fleet API', () => {
  it('serves health and a dashboard with accessible form labels', async () => {
    const app = createApp();
    const health = await request(app).get('/api/health').expect(200);
    expect(health.body).toEqual({ status: 'ok', version: '0.1.0' });
    const page = await request(app).get('/').expect(200);
    expect(page.text).toContain('Contoso Fleet Ops');
    expect(page.text).toContain('label for="title"');
  });

  it('lists seeded assets and retrieves an individual asset', async () => {
    const app = createApp();
    const assets = await request(app).get('/api/assets').expect(200);
    expect(assets.body).toHaveLength(12);
    const asset = await request(app).get('/api/assets/truck-1').expect(200);
    expect(asset.body).toMatchObject({ name: 'Truck 42', type: 'truck' });
    const missing = await request(app).get('/api/assets/missing').expect(404);
    expect(missing.body.error.code).toBe('NOT_FOUND');
  });

  it('creates, lists and patches a work order', async () => {
    const app = createApp();
    const created = await request(app)
      .post('/api/work-orders')
      .send({
        assetId: 'vessel-1',
        title: 'Inspect coolant',
        priority: 'high',
        dueDate: '2026-12-01',
        assignee: 'Casey Park',
      })
      .expect(201);
    const id = created.body.id as string;
    const updated = await request(app)
      .patch(`/api/work-orders/${id}`)
      .send({ status: 'done' })
      .expect(200);
    expect(updated.body).toMatchObject({ id, status: 'done' });
    const list = await request(app).get('/api/work-orders').expect(200);
    expect(list.body).toHaveLength(26);
  });

  it('returns consistent errors for invalid input and missing work orders', async () => {
    const app = createApp();
    const invalid = await request(app)
      .post('/api/work-orders')
      .send({ title: 'Missing required fields' })
      .expect(400);
    expect(invalid.body.error).toMatchObject({ code: 'INVALID_INPUT' });
    const missing = await request(app)
      .patch('/api/work-orders/missing')
      .send({ status: 'done' })
      .expect(404);
    expect(missing.body.error.message).toBe('Work order not found.');
  });

  it('returns JSON errors for malformed JSON and unknown routes', async () => {
    const app = createApp();
    const malformed = await request(app)
      .post('/api/work-orders')
      .set('Content-Type', 'application/json')
      .send('{"broken"')
      .expect(400);
    expect(malformed.body.error.code).toBe('INVALID_INPUT');
    const unknown = await request(app).get('/api/unknown').expect(404);
    expect(unknown.body.error.code).toBe('NOT_FOUND');
  });

  it('keeps application instances isolated', async () => {
    const first = createApp();
    const second = createApp();
    await request(first)
      .patch('/api/work-orders/wo-001')
      .send({ status: 'done' })
      .expect(200);
    const [changed, unchanged] = await Promise.all([
      request(first).get('/api/stats').expect(200),
      request(second).get('/api/stats').expect(200),
    ]);
    expect(changed.body.open).toBe(unchanged.body.open - 1);
  });
});
