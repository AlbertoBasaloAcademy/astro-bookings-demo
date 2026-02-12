import type { APIRequestContext } from '@playwright/test';

/**
 * Test data setup utilities for E2E tests
 */

export interface TestData {
  rocket: any;
  launch: any;
  customer: any;
}

/**
 * Create test rocket with standard capacity
 */
export async function createTestRocket(
  request: APIRequestContext,
  baseURL: string,
  name?: string
): Promise<any> {
  const rocketResponse = await request.post(`${baseURL}/api/rockets`, {
    data: {
      name: name || `Test Rocket ${Date.now()}`,
      range: 'orbital',
      capacity: 5,
    },
  });
  return rocketResponse.json();
}

/**
 * Create test launch with active status
 */
export async function createTestLaunch(
  request: APIRequestContext,
  baseURL: string,
  rocketId: string,
  price: number = 100,
  status: string = 'active'
): Promise<any> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1);

  const launchResponse = await request.post(`${baseURL}/api/launches`, {
    data: {
      rocketId,
      scheduledDate: futureDate.toISOString(),
      price,
      minimumPassengers: 1,
      status,
    },
  });
  return launchResponse.json();
}

/**
 * Create test customer with valid data
 */
export async function createTestCustomer(
  request: APIRequestContext,
  baseURL: string,
  name: string = 'Test User'
): Promise<any> {
  const customerResponse = await request.post(`${baseURL}/api/customers`, {
    data: {
      name,
      email: `user-${Date.now()}@example.com`,
      phone: '+1234567890',
    },
  });
  return customerResponse.json();
}

/**
 * Setup complete test data (rocket, launch, and customer)
 */
export async function setupTestData(
  request: APIRequestContext,
  baseURL: string
): Promise<TestData> {
  const rocket = await createTestRocket(request, baseURL);
  const launch = await createTestLaunch(request, baseURL, rocket.id);
  const customer = await createTestCustomer(request, baseURL);

  return { rocket, launch, customer };
}
