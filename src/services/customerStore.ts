import { customerRepository } from './customer.repository.js';
import { CustomerService } from './customer.service.js';

export const customerStore = new CustomerService(customerRepository);
