import { expect, test } from '@playwright/test';
import type { Express } from 'express';
import http from 'node:http';
import type { AddressInfo } from 'node:net';

let server: http.Server;
let baseURL: string;
let app: Express;

// Start the Express app on a random port for isolated e2e tests.
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

test.describe('Rocket Management API', () => {
  test('should create a rocket with valid data and return 201', async ({ request }) => {
    const rocketData = {
      name: 'Falcon Heavy',
      range: 'orbital',
      capacity: 8
    };

    const response = await request.post(`${baseURL}/api/rockets`, {
      data: rocketData
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeTruthy();
    expect(body.name).toBe(rocketData.name);
    expect(body.range).toBe(rocketData.range);
    expect(body.capacity).toBe(rocketData.capacity);
    expect(body.createdAt).toBeTruthy();
    expect(body.updatedAt).toBeTruthy();
  });

  test('should retrieve a rocket by ID and return 200', async ({ request }) => {
    // Create a rocket first
    const createResponse = await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Starship', range: 'mars', capacity: 10 }
    });
    const createdRocket = await createResponse.json();

    // Get the rocket by ID
    const response = await request.get(`${baseURL}/api/rockets/${createdRocket.id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(createdRocket.id);
    expect(body.name).toBe('Starship');
    expect(body.range).toBe('mars');
    expect(body.capacity).toBe(10);
  });

  test('should return 404 when rocket does not exist', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/rockets/non-existent-id`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test('should update an existing rocket with valid data and return 200', async ({ request }) => {
    // Create a rocket first
    const createResponse = await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Dragon', range: 'orbital', capacity: 5 }
    });
    const createdRocket = await createResponse.json();

    // Update the rocket
    const updateData = { name: 'Dragon XL', capacity: 7 };
    const response = await request.put(`${baseURL}/api/rockets/${createdRocket.id}`, {
      data: updateData
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('Dragon XL');
    expect(body.capacity).toBe(7);
    expect(body.range).toBe('orbital'); // Should remain unchanged
  });

  test('should return 400 when creating rocket with invalid capacity', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Invalid Rocket', range: 'orbital', capacity: 15 }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
    expect(body.details).toBeTruthy();
  });

  test('should return 400 when creating rocket with undefined range', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Invalid Rocket', range: 'invalid-range', capacity: 5 }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
    expect(body.details).toBeTruthy();
  });

  test('should delete a rocket by ID and return 204', async ({ request }) => {
    // Create a rocket first
    const createResponse = await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Temporary Rocket', range: 'suborbital', capacity: 3 }
    });
    const createdRocket = await createResponse.json();

    // Delete the rocket
    const response = await request.delete(`${baseURL}/api/rockets/${createdRocket.id}`);
    expect(response.status()).toBe(204);

    // Verify it's deleted
    const getResponse = await request.get(`${baseURL}/api/rockets/${createdRocket.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should return list of all rockets with pagination metadata', async ({ request }) => {
    // Create a few rockets
    await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Rocket 1', range: 'orbital', capacity: 4 }
    });
    await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Rocket 2', range: 'moon', capacity: 6 }
    });

    const response = await request.get(`${baseURL}/api/rockets`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.total).toBeGreaterThanOrEqual(2);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBeTruthy();
    expect(typeof body.hasMore).toBe('boolean');
  });

  test('should filter rockets by range', async ({ request }) => {
    // Create rockets with different ranges
    await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Orbital Rocket A', range: 'orbital', capacity: 5 }
    });
    await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Orbital Rocket B', range: 'orbital', capacity: 6 }
    });
    await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Mars Rocket', range: 'mars', capacity: 8 }
    });

    const response = await request.get(`${baseURL}/api/rockets?range=orbital`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.length).toBeGreaterThanOrEqual(2);
    body.data.forEach((rocket: any) => {
      expect(rocket.range).toBe('orbital');
    });
  });

  test('should filter rockets by minimum capacity', async ({ request }) => {
    // Create rockets with different capacities
    await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Small Rocket', range: 'suborbital', capacity: 2 }
    });
    await request.post(`${baseURL}/api/rockets`, {
      data: { name: 'Large Rocket', range: 'orbital', capacity: 8 }
    });

    const response = await request.get(`${baseURL}/api/rockets?minCapacity=5`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    body.data.forEach((rocket: any) => {
      expect(rocket.capacity).toBeGreaterThanOrEqual(5);
    });
  });
});
