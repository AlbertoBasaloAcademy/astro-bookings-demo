import { expect, test } from '@playwright/test';
import type { Express } from 'express';
import http from 'node:http';
import type { AddressInfo } from 'node:net';

let server: http.Server;
let baseURL: string;
let app: Express;

// Start the Express app on a random port for isolated smoke checks.
test.beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  ({ app } = await import('../src/index'));

  await new Promise<void>((resolve, reject) => {
    server = app.listen(0, () => resolve());
    server.on('error', reject);
  });

  const address = server.address() as AddressInfo;
  baseURL = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  if (!server) return;

  await new Promise<void>((resolve, reject) => {
    server.close(err => (err ? reject(err) : resolve()));
  });
});

test('health endpoint returns ok', async ({ request }) => {
  const response = await request.get(`${baseURL}/health`);
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.status).toBe('ok');
  expect(body.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);
});
