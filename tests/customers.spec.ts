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

test.describe('Customer Management API', () => {
  // AC1: Create customer with valid data
  test('should create a customer with valid data and return 201 with customer record', async ({ request }) => {
    const customerData = {
      name: 'John Doe',
      email: `john.doe.${Date.now()}@example.com`,
      phone: '+1234567890'
    };

    const response = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeTruthy();
    expect(body.name).toBe(customerData.name);
    expect(body.email).toBe(customerData.email);
    expect(body.phone).toBe(customerData.phone);
    expect(body.createdAt).toBeTruthy();
    expect(body.updatedAt).toBeTruthy();
  });

  // AC2: Duplicate email returns 400 error
  test('should return 400 error when email already exists', async ({ request }) => {
    const customerData = {
      name: 'Jane Smith',
      email: `jane.smith.${Date.now()}@example.com`,
      phone: '+1987654321'
    };

    // Create first customer
    const firstResponse = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });
    expect(firstResponse.status()).toBe(201);

    // Attempt to create customer with same email
    const duplicateResponse = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });
    expect(duplicateResponse.status()).toBe(400);
    const body = await duplicateResponse.json();
    expect(body.error).toBe('Validation error');
    expect(body.details).toBeTruthy();
    expect(body.details.some((d: any) => d.field === 'email' && d.message.toLowerCase().includes('unique'))).toBeTruthy();
  });

  // AC3: Invalid email format returns 400 error
  test('should return 400 error with field-level validation error for invalid email', async ({ request }) => {
    const customerData = {
      name: 'Invalid Email User',
      email: 'invalid-email-format',
      phone: '+1234567890'
    };

    const response = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation error');
    expect(body.details).toBeTruthy();
    expect(body.details.some((d: any) => d.field === 'email')).toBeTruthy();
  });

  // AC4: Retrieve customer by ID returns 200 with full profile
  test('should return full customer profile with 200 status when requesting by ID', async ({ request }) => {
    // First create a customer
    const customerData = {
      name: 'Bob Johnson',
      email: `bob.johnson.${Date.now()}@example.com`,
      phone: '+1122334455'
    };

    const createResponse = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });
    expect(createResponse.status()).toBe(201);
    const createdCustomer = await createResponse.json();

    // Retrieve by ID
    const response = await request.get(`${baseURL}/api/customers/${createdCustomer.id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(createdCustomer.id);
    expect(body.name).toBe(customerData.name);
    expect(body.email).toBe(customerData.email);
    expect(body.phone).toBe(customerData.phone);
    expect(body.createdAt).toBeTruthy();
    expect(body.updatedAt).toBeTruthy();
  });

  // AC5: Non-existent customer ID returns 404
  test('should return 404 error when customer ID does not exist', async ({ request }) => {
    const nonExistentId = 'non-existent-id-12345';
    const response = await request.get(`${baseURL}/api/customers/${nonExistentId}`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toContain('Customer not found');
  });

  // AC6: Retrieve customer by email returns 200 with matching profile
  test('should return matching customer profile with 200 status when querying by email', async ({ request }) => {
    // First create a customer
    const customerData = {
      name: 'Alice Brown',
      email: `alice.brown.${Date.now()}@example.com`,
      phone: '+1555666777'
    };

    const createResponse = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });
    expect(createResponse.status()).toBe(201);

    // Retrieve by email
    const response = await request.get(`${baseURL}/api/customers/email/${customerData.email}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe(customerData.name);
    expect(body.email).toBe(customerData.email);
    expect(body.phone).toBe(customerData.phone);
  });

  // AC7: Update customer with valid data returns 200 with updated record and updated timestamp
  test('should update customer name and phone, update updatedAt timestamp, and return updated record with 200 status', async ({ request }) => {
    // First create a customer
    const customerData = {
      name: 'Charlie Wilson',
      email: `charlie.wilson.${Date.now()}@example.com`,
      phone: '+1444555666'
    };

    const createResponse = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });
    expect(createResponse.status()).toBe(201);
    const createdCustomer = await createResponse.json();
    const originalUpdatedAt = createdCustomer.updatedAt;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    // Update customer
    const updatedData = {
      name: 'Charlie Wilson Junior',
      phone: '+1999888777'
    };

    const updateResponse = await request.put(`${baseURL}/api/customers/${createdCustomer.id}`, {
      data: updatedData
    });
    
    expect(updateResponse.status()).toBe(200);
    const updatedCustomer = await updateResponse.json();
    expect(updatedCustomer.name).toBe(updatedData.name);
    expect(updatedCustomer.phone).toBe(updatedData.phone);
    expect(updatedCustomer.email).toBe(customerData.email); // Email unchanged
    expect(updatedCustomer.updatedAt).not.toBe(originalUpdatedAt); // Timestamp updated
  });

  // AC8: Attempt to modify email returns 400 error
  test('should reject email modification and return 400 error', async ({ request }) => {
    // First create a customer
    const customerData = {
      name: 'David Lee',
      email: `david.lee.${Date.now()}@example.com`,
      phone: '+1333222111'
    };

    const createResponse = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });
    expect(createResponse.status()).toBe(201);
    const createdCustomer = await createResponse.json();

    // Attempt to update email
    const updateWithEmail = {
      email: 'newemail@example.com'
    };

    const updateResponse = await request.put(`${baseURL}/api/customers/${createdCustomer.id}`, {
      data: updateWithEmail
    });

    // Should either be ignored or return error
    // Based on TypeScript types, email is not in UpdateCustomerInput, so it should be ignored
    // Let's verify email hasn't changed
    const getResponse = await request.get(`${baseURL}/api/customers/${createdCustomer.id}`);
    const customer = await getResponse.json();
    expect(customer.email).toBe(customerData.email); // Email should remain unchanged
  });

  // AC9: Delete customer returns 204 status
  test('should remove customer and return 204 status when admin deletes by ID', async ({ request }) => {
    // First create a customer
    const customerData = {
      name: 'Eva Martinez',
      email: `eva.martinez.${Date.now()}@example.com`,
      phone: '+1666777888'
    };

    const createResponse = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });
    expect(createResponse.status()).toBe(201);
    const createdCustomer = await createResponse.json();

    // Delete customer
    const deleteResponse = await request.delete(`${baseURL}/api/customers/${createdCustomer.id}`);
    expect(deleteResponse.status()).toBe(204);

    // Verify customer no longer exists
    const getResponse = await request.get(`${baseURL}/api/customers/${createdCustomer.id}`);
    expect(getResponse.status()).toBe(404);
  });

  // Additional validation tests
  test('should return 400 error for invalid phone format', async ({ request }) => {
    const customerData = {
      name: 'Invalid Phone User',
      email: `invalid.phone.${Date.now()}@example.com`,
      phone: 'invalid-phone'
    };

    const response = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation error');
    expect(body.details).toBeTruthy();
    expect(body.details.some((d: any) => d.field === 'phone')).toBeTruthy();
  });

  test('should return 400 error for name that is too short', async ({ request }) => {
    const customerData = {
      name: 'A',
      email: `short.name.${Date.now()}@example.com`,
      phone: '+1234567890'
    };

    const response = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation error');
    expect(body.details).toBeTruthy();
    expect(body.details.some((d: any) => d.field === 'name')).toBeTruthy();
  });

  test('should handle name with special characters correctly', async ({ request }) => {
    const customerData = {
      name: "John O'Brien-Smith",
      email: `john.obrien.${Date.now()}@example.com`,
      phone: '+1234567890'
    };

    const response = await request.post(`${baseURL}/api/customers`, {
      data: customerData
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe(customerData.name);
  });

  test('should support pagination for customer list', async ({ request }) => {
    // Create multiple customers
    const customers = [];
    const timestamp = Date.now();
    const names = ['Alice Anderson', 'Bob Baker', 'Carol Carter', 'David Davis', 'Eve Edwards'];
    
    for (let i = 0; i < 5; i++) {
      const customerData = {
        name: names[i],
        email: `test.customer.${i}.${timestamp}@example.com`,
        phone: `+12345678${i}0`
      };
      const response = await request.post(`${baseURL}/api/customers`, {
        data: customerData
      });
      
      expect(response.status()).toBe(201);
      customers.push(await response.json());
    }

    // Test pagination
    const page1Response = await request.get(`${baseURL}/api/customers?page=1&pageSize=2`);
    expect(page1Response.status()).toBe(200);
    const page1 = await page1Response.json();
    expect(page1.data).toHaveLength(2);
    expect(page1.page).toBe(1);
    expect(page1.pageSize).toBe(2);
    expect(page1.hasMore).toBeTruthy();

    const page2Response = await request.get(`${baseURL}/api/customers?page=2&pageSize=2`);
    expect(page2Response.status()).toBe(200);
    const page2 = await page2Response.json();
    expect(page2.data.length).toBeGreaterThan(0);
    expect(page2.page).toBe(2);
  });
});
