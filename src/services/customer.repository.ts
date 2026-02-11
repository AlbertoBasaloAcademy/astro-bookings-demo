import type {
    CreateCustomerInput,
    Customer,
    CustomerQueryOptions,
    PaginatedResponse,
    UpdateCustomerInput,
} from '../types/customer.js';
import { normalizeEmail } from '../utils/validation.js';

export interface CustomerRepository {
  save(customer: Customer): void;
  findById(id: string): Customer | undefined;
  findByEmail(email: string): Customer | undefined;
  findAll(options?: CustomerQueryOptions): PaginatedResponse<Customer>;
  update(customer: Customer): void;
  deleteById(id: string): boolean;
}

export class InMemoryCustomerRepository implements CustomerRepository {
  private customers: Map<string, Customer> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private nextId = 1;

  save(customer: Customer): void {
    this.customers.set(customer.id, customer);
    this.emailIndex.set(normalizeEmail(customer.email), customer.id);
  }

  findById(id: string): Customer | undefined {
    return this.customers.get(id);
  }

  findByEmail(email: string): Customer | undefined {
    const normalizedEmail = normalizeEmail(email);
    const customerId = this.emailIndex.get(normalizedEmail);
    return customerId ? this.customers.get(customerId) : undefined;
  }

  findAll(options: CustomerQueryOptions = {}): PaginatedResponse<Customer> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const emailFilter = options.email ? normalizeEmail(options.email) : undefined;
    const nameFilter = options.name?.trim().toLowerCase();

    let results = Array.from(this.customers.values());

    if (emailFilter) {
      results = results.filter((customer) => normalizeEmail(customer.email) === emailFilter);
    }

    if (nameFilter) {
      results = results.filter((customer) => customer.name.toLowerCase().includes(nameFilter));
    }

    const total = results.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      data: paginatedResults,
      total,
      page,
      pageSize,
      hasMore: endIndex < total,
    };
  }

  update(customer: Customer): void {
    this.customers.set(customer.id, customer);
  }

  deleteById(id: string): boolean {
    const customer = this.customers.get(id);
    if (!customer) {
      return false;
    }

    this.emailIndex.delete(normalizeEmail(customer.email));
    return this.customers.delete(id);
  }

  generateId(): string {
    return String(this.nextId++);
  }
}

export const customerRepository = new InMemoryCustomerRepository();
