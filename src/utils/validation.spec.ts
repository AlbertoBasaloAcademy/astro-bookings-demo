import { describe, expect, it } from 'vitest';
import { CreateRocketInput } from '../types/rocket.js';
import { ROCKET_STORE_CONSTANTS, validateRocketInput } from './validation.js';

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
