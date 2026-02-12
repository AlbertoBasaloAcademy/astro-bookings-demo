import { describe, expect, it } from 'vitest';
import { CreateCustomerInput, UpdateCustomerInput } from '../types/customer.js';
import { CreateRocketInput } from '../types/rocket.js';
import {
    CUSTOMER_VALIDATION_CONSTANTS,
    ROCKET_STORE_CONSTANTS,
    validateCustomerInput,
    validateCustomerUpdateInput,
    validateEmailUniqueness,
    validateRocketInput,
} from './validation.js';

describe('validateRocketInput', () => {
  describe('name validation', () => {
    it('should pass with valid name', () => {
      const input: CreateRocketInput = {
        name: 'Apollo',
        range: 'orbital',
        capacity: 5,
      };
      const errors = validateRocketInput(input);
      expect(errors).toHaveLength(0);
    });

    it('should fail when name is missing', () => {
      const input = {
        range: 'orbital',
        capacity: 5,
      } as CreateRocketInput;
      const errors = validateRocketInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('name');
      expect(errors[0].message).toContain('required');
    });

    it('should fail when name is empty after trim', () => {
      const input: CreateRocketInput = {
        name: '   ',
        range: 'orbital',
        capacity: 5,
      };
      const errors = validateRocketInput(input);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('name');
      expect(errors[0].message).toContain('required');
    });
  });

  describe('range validation', () => {
    it('should pass with valid ranges', () => {
      const validRanges: Array<'suborbital' | 'orbital' | 'moon' | 'mars'> = [
        'suborbital',
        'orbital',
        'moon',
        'mars',
      ];
      validRanges.forEach((range) => {
        const input: CreateRocketInput = { name: 'Test', range, capacity: 5 };
        const errors = validateRocketInput(input);
        const rangeErrors = errors.filter((e) => e.field === 'range');
        expect(rangeErrors).toHaveLength(0);
      });
    });

    it('should fail with invalid range', () => {
      const input = {
        name: 'Test',
        range: 'invalid',
        capacity: 5,
      } as unknown as CreateRocketInput;
      const errors = validateRocketInput(input);
      const rangeError = errors.find((e) => e.field === 'range');
      expect(rangeError).toBeDefined();
      expect(rangeError?.message).toContain('suborbital');
      expect(rangeError?.message).toContain('orbital');
      expect(rangeError?.message).toContain('moon');
      expect(rangeError?.message).toContain('mars');
    });
  });

  describe('capacity validation', () => {
    it('should pass with boundary values 1 and 10', () => {
      const minInput: CreateRocketInput = { name: 'Test', range: 'orbital', capacity: 1 };
      const maxInput: CreateRocketInput = { name: 'Test', range: 'orbital', capacity: 10 };

      expect(validateRocketInput(minInput)).toHaveLength(0);
      expect(validateRocketInput(maxInput)).toHaveLength(0);
    });

    it('should fail with capacity of 0', () => {
      const input: CreateRocketInput = { name: 'Test', range: 'orbital', capacity: 0 };
      const errors = validateRocketInput(input);
      const capacityError = errors.find((e) => e.field === 'capacity');
      expect(capacityError).toBeDefined();
      expect(capacityError?.message).toContain('between 1 and 10');
    });

    it('should fail with capacity of 11', () => {
      const input: CreateRocketInput = { name: 'Test', range: 'orbital', capacity: 11 };
      const errors = validateRocketInput(input);
      const capacityError = errors.find((e) => e.field === 'capacity');
      expect(capacityError).toBeDefined();
      expect(capacityError?.message).toContain('between 1 and 10');
    });

    it('should fail with non-integer capacity', () => {
      const input: CreateRocketInput = { name: 'Test', range: 'orbital', capacity: 5.5 };
      const errors = validateRocketInput(input);
      const capacityError = errors.find((e) => e.field === 'capacity');
      expect(capacityError).toBeDefined();
      expect(capacityError?.message).toContain('integer');
    });
  });

  describe('multiple validation errors', () => {
    it('should return all validation errors', () => {
      const input = {
        name: '',
        range: 'invalid',
        capacity: 0,
      } as unknown as CreateRocketInput;
      const errors = validateRocketInput(input);
      expect(errors).toHaveLength(3);
      expect(errors.some((e) => e.field === 'name')).toBe(true);
      expect(errors.some((e) => e.field === 'range')).toBe(true);
      expect(errors.some((e) => e.field === 'capacity')).toBe(true);
    });
  });

  describe('ROCKET_STORE_CONSTANTS', () => {
    it('should export validation constants', () => {
      expect(ROCKET_STORE_CONSTANTS.MIN_CAPACITY).toBe(1);
      expect(ROCKET_STORE_CONSTANTS.MAX_CAPACITY).toBe(10);
      expect(ROCKET_STORE_CONSTANTS.VALID_RANGES).toEqual([
        'suborbital',
        'orbital',
        'moon',
        'mars',
      ]);
    });
  });
});

describe('validateCustomerInput', () => {
  it('should pass with valid input', () => {
    const input: CreateCustomerInput = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '+15551234567',
    };

    expect(validateCustomerInput(input)).toHaveLength(0);
  });

  it('should fail when fields are missing', () => {
    const input = {} as CreateCustomerInput;
    const errors = validateCustomerInput(input);

    expect(errors).toHaveLength(3);
    expect(errors.some((error) => error.field === 'name')).toBe(true);
    expect(errors.some((error) => error.field === 'email')).toBe(true);
    expect(errors.some((error) => error.field === 'phone')).toBe(true);
  });

  it('should fail with invalid email and phone', () => {
    const input: CreateCustomerInput = {
      name: 'Valid Name',
      email: 'invalid-email',
      phone: '12345',
    };

    const errors = validateCustomerInput(input);
    expect(errors.some((error) => error.field === 'email')).toBe(true);
    expect(errors.some((error) => error.field === 'phone')).toBe(true);
  });

  it('should fail with invalid name characters', () => {
    const input: CreateCustomerInput = {
      name: 'Ada123',
      email: 'ada@example.com',
      phone: '+15551234567',
    };

    const errors = validateCustomerInput(input);
    const nameError = errors.find((error) => error.field === 'name');
    expect(nameError).toBeDefined();
  });
});

describe('validateCustomerUpdateInput', () => {
  it('should allow valid partial updates', () => {
    const input: UpdateCustomerInput = {
      name: 'Grace Hopper',
    };

    expect(validateCustomerUpdateInput(input)).toHaveLength(0);
  });

  it('should reject email updates', () => {
    const input = {
      email: 'new@example.com',
    } as UpdateCustomerInput & { email?: string };

    const errors = validateCustomerUpdateInput(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('email');
  });

  it('should reject invalid phone updates', () => {
    const input: UpdateCustomerInput = {
      phone: 'invalid-phone',
    };

    const errors = validateCustomerUpdateInput(input);
    const phoneError = errors.find((error) => error.field === 'phone');
    expect(phoneError).toBeDefined();
  });
});

describe('validateEmailUniqueness', () => {
  it('should return error when email already exists', () => {
    const lookup = (email: string) => (email === 'exists@example.com' ? { id: '1' } : undefined);

    const errors = validateEmailUniqueness('exists@example.com', lookup);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('email');
  });

  it('should allow same email for current customer', () => {
    const lookup = (email: string) => (email === 'exists@example.com' ? { id: '1' } : undefined);

    const errors = validateEmailUniqueness('exists@example.com', lookup, '1');
    expect(errors).toHaveLength(0);
  });
});

describe('CUSTOMER_VALIDATION_CONSTANTS', () => {
  it('should export validation constants', () => {
    expect(CUSTOMER_VALIDATION_CONSTANTS.CUSTOMER_NAME_MIN_LENGTH).toBe(2);
    expect(CUSTOMER_VALIDATION_CONSTANTS.CUSTOMER_NAME_MAX_LENGTH).toBe(60);
    expect(CUSTOMER_VALIDATION_CONSTANTS.CUSTOMER_EMAIL_REGEX).toBeInstanceOf(RegExp);
    expect(CUSTOMER_VALIDATION_CONSTANTS.CUSTOMER_PHONE_REGEX).toBeInstanceOf(RegExp);
  });
});
