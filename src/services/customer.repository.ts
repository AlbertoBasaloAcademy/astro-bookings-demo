import type {
    CreateCustomerInput,
    Customer,
    CustomerQueryOptions,
    PaginatedResponse,
    UpdateCustomerInput,
} from '../types/customer.js';
import { ValidationError } from '../utils/error-handler.js';
import { customerStore } from './customerStore.js';

export interface CustomerRepository {
  create(input: CreateCustomerInput): Customer;
  findById(id: string): Customer | undefined;
  findByEmail(email: string): Customer | undefined;
  findAll(options?: CustomerQueryOptions): PaginatedResponse<Customer>;
  update(id: string, updates: UpdateCustomerInput): Customer | undefined;
  deleteById(id: string): boolean;
}

export class InMemoryCustomerRepository implements CustomerRepository {
  create(input: CreateCustomerInput): Customer {
    const created = customerStore.add(input);
    if (!created) {
      throw new ValidationError([{ field: 'email', message: 'Email must be unique' }]);
    }

    return created;
  }

  findById(id: string): Customer | undefined {
    return customerStore.getById(id);
  }

  findByEmail(email: string): Customer | undefined {
    return customerStore.getByEmail(email);
  }

  findAll(options: CustomerQueryOptions = {}): PaginatedResponse<Customer> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const normalizedEmail = options.email?.trim().toLowerCase();
    const normalizedName = options.name?.trim().toLowerCase();

    let results = customerStore.getAll();

    if (normalizedEmail) {
      results = results.filter((customer) => customer.email.toLowerCase() === normalizedEmail);
    }

    if (normalizedName) {
      results = results.filter((customer) => customer.name.toLowerCase().includes(normalizedName));
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

  update(id: string, updates: UpdateCustomerInput): Customer | undefined {
    return customerStore.update(id, updates);
  }

  deleteById(id: string): boolean {
    return customerStore.delete(id);
  }
}

export const customerRepository = new InMemoryCustomerRepository();
