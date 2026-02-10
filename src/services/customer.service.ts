import type {
    CreateCustomerInput,
    Customer,
    CustomerQueryOptions,
    PaginatedResponse,
    UpdateCustomerInput,
} from '../types/customer.js';
import { ValidationError } from '../utils/error-handler.js';
import { info } from '../utils/logger.js';
import {
    validateCustomerInput,
    validateCustomerUpdateInput,
    validateEmailUniqueness,
} from '../utils/validation.js';
import type { CustomerRepository } from './customer.repository.js';
import { customerRepository } from './customer.repository.js';

export class CustomerService {
  constructor(private repository: CustomerRepository) {}

  create(input: CreateCustomerInput): Customer {
    const errors = validateCustomerInput(input);
    const uniqueErrors = validateEmailUniqueness(input.email, (email) =>
      this.repository.findByEmail(email)
    );

    const allErrors = [...errors, ...uniqueErrors];
    if (allErrors.length > 0) {
      throw new ValidationError(allErrors);
    }

    const customer = this.repository.create(input);
    info('Customer created', { id: customer.id, email: customer.email });
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

    const updated = this.repository.update(id, input);
    if (updated) {
      info('Customer updated', { id: updated.id });
    }

    return updated;
  }

  delete(id: string): boolean {
    const deleted = this.repository.deleteById(id);
    if (deleted) {
      info('Customer deleted', { id });
    }

    return deleted;
  }
}

export const customerService = new CustomerService(customerRepository);
