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

test.describe('Booking Management API', () => {
  // Setup: Create test rocket, launch, and customer for booking tests
  async function setupTestData(request: any) {
    // Create rocket
    const rocketResponse = await request.post(`${baseURL}/api/rockets`, {
      data: {
        name: `Test Rocket ${Date.now()}`,
        range: 'orbital',
        capacity: 5
      }
    });
    const rocket = await rocketResponse.json();

    // Create launch (in active status so it can be booked)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    
    const launchResponse = await request.post(`${baseURL}/api/launches`, {
      data: {
        rocketId: rocket.id,
        scheduledDate: futureDate.toISOString(),
        price: 100,
        minimumPassengers: 1,
        status: 'active'
      }
    });
    const launch = await launchResponse.json();

    // Create customer
    const customerResponse = await request.post(`${baseURL}/api/customers`, {
      data: {
        name: 'Test User',
        email: `user-${Date.now()}@example.com`,
        phone: '+1234567890'
      }
    });
    const customer = await customerResponse.json();

    return { rocket, launch, customer };
  }

  // AC1: Create booking with valid data → HTTP 201
  test('should create a booking with valid data and return HTTP 201 with booking confirmation', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);

    const bookingData = {
      launchId: launch.id,
      customerEmail: customer.email,
      seatCount: 2
    };

    const response = await request.post(`${baseURL}/api/bookings`, {
      data: bookingData
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    
    // Verify booking confirmation details
    expect(body.id).toBeTruthy();
    expect(body.launchId).toBe(launch.id);
    expect(body.customerEmail).toBe(customer.email);
    expect(body.seatCount).toBe(2);
    expect(body.status).toBe('pending');
    expect(body.paymentStatus).toBe('pending');
    expect(body.createdAt).toBeTruthy();
    expect(body.updatedAt).toBeTruthy();
  });

  // AC2: Insufficient seats available → HTTP 400 with error message
  test('should return HTTP 400 with "Insufficient seats available" when exceeding capacity', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);

    // First booking: use 4 out of 5 seats
    await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer.email,
        seatCount: 4
      }
    });

    // Second booking: try to book 2 more seats (exceeds 5 total capacity)
    const customer2Response = await request.post(`${baseURL}/api/customers`, {
      data: {
        name: 'Jane Smith',
        email: `user2-${Date.now()}@example.com`,
        phone: '+1234567890'
      }
    });
    const customer2 = await customer2Response.json();

    const response = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer2.email,
        seatCount: 2
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Insufficient seats available');
  });

  // AC3: Launch not in active status → HTTP 400
  test('should return HTTP 400 when booking non-active launch', async ({ request }) => {
    const { rocket, customer } = await setupTestData(request);

    // Create launch with scheduled status (not active)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    
    const launchResponse = await request.post(`${baseURL}/api/launches`, {
      data: {
        rocketId: rocket.id,
        scheduledDate: futureDate.toISOString(),
        price: 100,
        minimumPassengers: 1,
        status: 'scheduled'
      }
    });
    const launch = await launchResponse.json();

    const response = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer.email,
        seatCount: 1
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Launch is not available for booking');
  });

  // AC4: Calculate total cost as seat quantity × launch price
  test('should calculate total cost as seatCount × launchPrice', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);
    
    const seatCount = 3;
    const expectedTotalPrice = seatCount * launch.price;

    const response = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer.email,
        seatCount: seatCount
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.totalPrice).toBe(expectedTotalPrice);
    expect(body.totalPrice).toBe(300); // 3 * 100
  });

  // AC5: Prevent concurrent overbooking and update availability immediately
  test('should prevent overbooking and update availability immediately', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);

    // Create three customers
    const customers = [customer];
    for (let i = 0; i < 2; i++) {
      const custResponse = await request.post(`${baseURL}/api/customers`, {
        data: {
          name: i === 0 ? 'Alice Brown' : 'Bob White',
          email: `user-${i}-${Date.now()}@example.com`,
          phone: '+1234567890'
        }
      });
      customers.push(await custResponse.json());
    }

    // First booking: 2 seats
    const response1 = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customers[0].email,
        seatCount: 2
      }
    });
    expect(response1.status()).toBe(201);

    // Check availability after first booking
    const availResponse1 = await request.get(`${baseURL}/api/launches/${launch.id}/availability`);
    const avail1 = await availResponse1.json();
    expect(avail1.availableSeats).toBe(3); // 5 - 2

    // Second booking: 3 seats
    const response2 = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customers[1].email,
        seatCount: 3
      }
    });
    expect(response2.status()).toBe(201);

    // Check availability after second booking
    const availResponse2 = await request.get(`${baseURL}/api/launches/${launch.id}/availability`);
    const avail2 = await availResponse2.json();
    expect(avail2.availableSeats).toBe(0); // 5 - 2 - 3

    // Third booking attempt: should fail due to no available seats
    const response3 = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customers[2].email,
        seatCount: 1
      }
    });
    expect(response3.status()).toBe(400);
  });

  // AC6: Retrieve customer booking history with complete details
  test('should return all bookings for customer with complete details including status and cost', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);

    // Create multiple bookings for the same customer
    const bookingData1 = {
      launchId: launch.id,
      customerEmail: customer.email,
      seatCount: 2
    };

    const booking1Response = await request.post(`${baseURL}/api/bookings`, {
      data: bookingData1
    });
    const booking1 = await booking1Response.json();

    // Create another launch and booking
    const rocket2Response = await request.post(`${baseURL}/api/rockets`, {
      data: {
        name: `Rocket 2 ${Date.now()}`,
        range: 'moon',
        capacity: 3
      }
    });
    const rocket2 = await rocket2Response.json();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    
    const launch2Response = await request.post(`${baseURL}/api/launches`, {
      data: {
        rocketId: rocket2.id,
        scheduledDate: futureDate.toISOString(),
        price: 200,
        minimumPassengers: 1,
        status: 'active'
      }
    });
    const launch2 = await launch2Response.json();

    const booking2Response = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch2.id,
        customerEmail: customer.email,
        seatCount: 1
      }
    });
    const booking2 = await booking2Response.json();

    // Retrieve customer booking history
    const response = await request.get(`${baseURL}/api/bookings/customer/${customer.email}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
    
    // Verify booking details
    const bookings = body.map((b: any) => ({ id: b.id }));
    expect(bookings.some((b: any) => b.id === booking1.id)).toBe(true);
    expect(bookings.some((b: any) => b.id === booking2.id)).toBe(true);
    
    // Verify complete details
    expect(body[0].customerEmail).toBe(customer.email);
    expect(body[0].status).toBeTruthy();
    expect(body[0].totalPrice).toBeTruthy();
    expect(body[0].seatCount).toBeTruthy();
  });

  // AC7: Invalid email format returns HTTP 400 with validation error
  test('should return HTTP 400 with validation error for invalid email format', async ({ request }) => {
    const { launch } = await setupTestData(request);

    const response = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: 'invalid-email-format', // Invalid email
        seatCount: 1
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation error');
    expect(body.details).toBeTruthy();
    expect(body.details.some((d: any) => d.field === 'customerEmail')).toBe(true);
  });

  // AC8: Payment status initialized as pending
  test('should initialize payment status as "pending" when booking is created', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);

    const response = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer.email,
        seatCount: 1
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.paymentStatus).toBe('pending');
  });

  // AC9: Rollback on failure - prevent booking if would exceed capacity
  test('should rollback booking and return HTTP 400 if total exceeds rocket capacity', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);

    // First booking: 3 seats (capacity is 5)
    const response1 = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer.email,
        seatCount: 3
      }
    });
    expect(response1.status()).toBe(201);

    // Create another customer
    const customer2Response = await request.post(`${baseURL}/api/customers`, {
      data: {
        name: 'Charlie Davis',
        email: `user3-${Date.now()}@example.com`,
        phone: '+1234567890'
      }
    });
    const customer2 = await customer2Response.json();

    // Second booking attempt: 3 seats (would total 6, exceeds capacity of 5)
    const response2 = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer2.email,
        seatCount: 3
      }
    });

    expect(response2.status()).toBe(400);
    const body = await response2.json();
    expect(body.error).toContain('Insufficient seats available');

    // Verify first booking is still valid and second wasn't created
    const historyResponse = await request.get(`${baseURL}/api/bookings/customer/${customer2.email}`);
    const history = await historyResponse.json();
    expect(history.length).toBe(0); // Second customer should have no bookings
  });

  // Additional: Retrieve booking by ID
  test('should retrieve a specific booking by ID and return HTTP 200', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);

    const createResponse = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer.email,
        seatCount: 2
      }
    });
    expect(createResponse.status()).toBe(201);
    const created = await createResponse.json();

    // Retrieve the booking by ID
    const response = await request.get(`${baseURL}/api/bookings/${created.id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(created.id);
    expect(body.launchId).toBe(launch.id);
    expect(body.customerEmail).toBe(customer.email);
    expect(body.seatCount).toBe(2);
  });

  // Additional: Return 404 when booking not found
  test('should return HTTP 404 when retrieving non-existent booking', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/bookings/non-existent-id`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  // Additional: Check launch availability endpoint
  test('should return launch availability with correct seat counts', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);

    // Create a booking
    const bookingResponse = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer.email,
        seatCount: 2
      }
    });
    expect(bookingResponse.status()).toBe(201);

    // Check availability
    const response = await request.get(`${baseURL}/api/launches/${launch.id}/availability`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.launchId).toBe(launch.id);
    expect(body.totalSeats).toBe(5); // Original rocket capacity
    expect(body.bookedSeats).toBe(2); // One booking with 2 seats
    expect(body.availableSeats).toBe(3); // 5 - 2
  });

  // Additional: Reject booking with 0 seats
  test('should return HTTP 400 when attempting to book 0 seats', async ({ request }) => {
    const { launch, customer } = await setupTestData(request);

    const response = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: customer.email,
        seatCount: 0
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation error');
    expect(body.details.some((d: any) => d.field === 'seatCount')).toBe(true);
  });

  // Additional: Reject booking for non-existent launch
  test('should return HTTP 400 when launch does not exist', async ({ request }) => {
    const { customer } = await setupTestData(request);

    const response = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: 'non-existent-launch-id',
        customerEmail: customer.email,
        seatCount: 1
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation error');
    expect(body.details.some((d: any) => d.field === 'launchId')).toBe(true);
  });

  // Additional: Reject booking for non-existent customer
  test('should return HTTP 400 when customer does not exist', async ({ request }) => {
    const { launch } = await setupTestData(request);

    const response = await request.post(`${baseURL}/api/bookings`, {
      data: {
        launchId: launch.id,
        customerEmail: 'nonexistent@example.com',
        seatCount: 1
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation error');
    expect(body.details.some((d: any) => d.field === 'customerEmail')).toBe(true);
  });
});
