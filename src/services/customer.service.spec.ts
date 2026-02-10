import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  CreateCustomerInput,
  Customer,
  CustomerQueryOptions,
  PaginatedResponse,
  UpdateCustomerInput,
} from '../types/customer.js';
import { ValidationError } from '../utils/error-handler.js';
import type { CustomerRepository } from './customer.repository.js';
import { CustomerService } from './customer.service.js';

describe('CustomerService', () => {
  let service: CustomerService;
  let mockRepository: CustomerRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      deleteById: vi.fn(),
    };

    service = new CustomerService(mockRepository);
  });

  describe('create', () => {
    it('should create a customer with valid input', () => {
      const input: CreateCustomerInput = {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: '+15551234567',
      };
      const created: Customer = {
        ...input,
        id: 'customer-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.findByEmail).mockReturnValue(undefined);
      vi.mocked(mockRepository.create).mockReturnValue(created);

      const result = service.create(input);

      expect(result).toEqual(created);
      expect(mockRepository.create).toHaveBeenCalledWith(input);
    });

    it('should throw ValidationError when email already exists', () => {
      const input: CreateCustomerInput = {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: '+15551234567',
      };

      vi.mocked(mockRepository.findByEmail).mockReturnValue({
        id: 'customer-1',
        name: 'Existing',
        email: 'ada@example.com',
        phone: '+15550000000',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(() => service.create(input)).toThrow(ValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid input', () => {
      const input = {
        name: '',
        email: 'invalid',
        phone: '123',
      } as CreateCustomerInput;

      vi.mocked(mockRepository.findByEmail).mockReturnValue(undefined);

      expect(() => service.create(input)).toThrow(ValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return customer when found', () => {
      const customer: Customer = {
        id: 'customer-1',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: '+15551234567',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.findById).mockReturnValue(customer);

      const result = service.getById('customer-1');

      expect(result).toEqual(customer);
      expect(mockRepository.findById).toHaveBeenCalledWith('customer-1');
    });

    it('should return undefined when not found', () => {
      vi.mocked(mockRepository.findById).mockReturnValue(undefined);

      const result = service.getById('missing');

      expect(result).toBeUndefined();
    });
  });

  describe('getByEmail', () => {
    it('should return customer when found', () => {
      const customer: Customer = {
        id: 'customer-1',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: '+15551234567',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.findByEmail).mockReturnValue(customer);

      const result = service.getByEmail('ada@example.com');

      expect(result).toEqual(customer);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('ada@example.com');
    });
  });

  describe('getAll', () => {
    it('should return paginated response from repository', () => {
      const options: CustomerQueryOptions = { page: 1, pageSize: 5, name: 'Ada' };
      const response: PaginatedResponse<Customer> = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 5,
        hasMore: false,
      };

      vi.mocked(mockRepository.findAll).mockReturnValue(response);

      const result = service.getAll(options);

      expect(result).toEqual(response);
      expect(mockRepository.findAll).toHaveBeenCalledWith(options);
    });
  });

  describe('update', () => {
    it('should update customer when found', () => {
      const updated: Customer = {
        id: 'customer-1',
        name: 'Grace Hopper',
        email: 'ada@example.com',
        phone: '+15551234567',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.update).mockReturnValue(updated);

      const result = service.update('customer-1', { name: 'Grace Hopper' });

      expect(result).toEqual(updated);
      expect(mockRepository.update).toHaveBeenCalledWith('customer-1', { name: 'Grace Hopper' });
    });

    it('should return undefined when customer not found', () => {
      vi.mocked(mockRepository.update).mockReturnValue(undefined);

      const result = service.update('missing', { name: 'Grace Hopper' });

      expect(result).toBeUndefined();
    });

    it('should throw ValidationError when email update is attempted', () => {
      const input = { email: 'new@example.com' } as UpdateCustomerInput & { email?: string };

      expect(() => service.update('customer-1', input)).toThrow(ValidationError);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid phone', () => {
      const input: UpdateCustomerInput = { phone: 'invalid' };

      expect(() => service.update('customer-1', input)).toThrow(ValidationError);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete customer and return true when found', () => {
      vi.mocked(mockRepository.deleteById).mockReturnValue(true);

      const result = service.delete('customer-1');

      expect(result).toBe(true);
      expect(mockRepository.deleteById).toHaveBeenCalledWith('customer-1');
    });

    it('should return false when customer not found', () => {
      vi.mocked(mockRepository.deleteById).mockReturnValue(false);

      const result = service.delete('missing');

      expect(result).toBe(false);
    });
  });
});
