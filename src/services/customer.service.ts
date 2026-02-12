import type {
  CreateCustomerInput,
  Customer,
  CustomerQueryOptions,
  PaginatedResponse,
  UpdateCustomerInput,
} from '../types/customer.js';
import { ValidationError } from '../utils/error-handler.js';
import { debug } from '../utils/logger.js';
import { validateCustomerInput, validateCustomerUpdateInput } from '../utils/validation.js';
import type { CustomerRepository } from './customer.repository.js';
import { customerRepository } from './customer.repository.js';

export class CustomerService {
  constructor(private repository: CustomerRepository) {}

  create(input: CreateCustomerInput): Customer {
    const errors = validateCustomerInput(input);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const existingCustomer = this.repository.findByEmail(input.email);
    if (existingCustomer) {
      throw new ValidationError([{ field: 'email', message: 'Email must be unique' }]);
    }

    const now = new Date();
    const customer: Customer = {
      id: (this.repository as any).generateId(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    this.repository.save(customer);
    debug('Customer created', { id: customer.id, email: customer.email });
    return customer;
  }

  getById(id: string): Customer | undefined {
    return this.repository.findById(id);
  }

  getByEmail(email: string): Customer | undefined {
    return this.repository.findByEmail(email);
  }

  getAll(options?: CustomerQueryOptions): PaginatedResponse<Customer> {
    return this.repository.findAll(options);
  }

  update(id: string, input: UpdateCustomerInput): Customer | undefined {
    const errors = validateCustomerUpdateInput(input as UpdateCustomerInput & { email?: string });
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const existing = this.repository.findById(id);
    if (!existing) {
      return undefined;
    }

    const updated: Customer = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };

    this.repository.update(updated);
    debug('Customer updated', { id: updated.id, email: updated.email });
    return updated;
  }

  delete(id: string): boolean {
    const customer = this.repository.findById(id);
    if (!customer) {
      return false;
    }

    const deleted = this.repository.deleteById(id);
    if (deleted) {
      debug('Customer deleted', { id, email: customer.email });
    }

    return deleted;
  }
}

export const customerService = new CustomerService(customerRepository);
