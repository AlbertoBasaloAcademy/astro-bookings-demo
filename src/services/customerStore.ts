import type { CreateCustomerInput, Customer, UpdateCustomerInput } from '../types/customer.js';

export class CustomerStore {
  private customers: Customer[] = [];
  private nextId = 1;

  add(input: CreateCustomerInput): Customer | undefined {
    if (this.getByEmail(input.email)) {
      return undefined;
    }

    const id = `customer-${this.nextId++}`;
    const now = new Date();
    const customer: Customer = {
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.customers.push(customer);
    return customer;
  }

  getById(id: string): Customer | undefined {
    return this.customers.find((customer) => customer.id === id);
  }

  getByEmail(email: string): Customer | undefined {
    const normalized = email.trim().toLowerCase();
    return this.customers.find((customer) => customer.email.toLowerCase() === normalized);
  }

  update(id: string, updates: UpdateCustomerInput): Customer | undefined {
    const index = this.customers.findIndex((customer) => customer.id === id);
    if (index === -1) {
      return undefined;
    }

    const existing = this.customers[index];
    const updated: Customer = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.customers[index] = updated;
    return updated;
  }

  delete(id: string): boolean {
    const index = this.customers.findIndex((customer) => customer.id === id);
    if (index === -1) {
      return false;
    }

    this.customers.splice(index, 1);
    return true;
  }

  getAll(): Customer[] {
    return [...this.customers];
  }

  clear(): void {
    this.customers = [];
    this.nextId = 1;
  }
}

export const customerStore = new CustomerStore();
