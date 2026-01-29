import { CreateRocketInput, RocketRange } from '../types/rocket.js';
import { ValidationErrorDetail } from './error-handler.js';

const VALID_RANGES: RocketRange[] = ['suborbital', 'orbital', 'moon', 'mars'] as const;
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 10;

export function validateRocketInput(input: CreateRocketInput): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];
  const addError = (field: string, message: string): void => {
    errors.push({ field, message });
  };

  const trimmedName = input.name?.trim();

  if (!trimmedName) {
    addError('name', 'Name is required and cannot be empty');
  }

  if (!VALID_RANGES.includes(input.range)) {
    addError('range', `Range must be one of: ${VALID_RANGES.join(', ')}`);
  }

  const { capacity } = input;
  const isCapacityValid =
    Number.isInteger(capacity) && capacity >= MIN_CAPACITY && capacity <= MAX_CAPACITY;

  if (!isCapacityValid) {
    addError(
      'capacity',
      `Capacity must be an integer between ${MIN_CAPACITY} and ${MAX_CAPACITY}`
    );
  }

  return errors;
}

export const ROCKET_STORE_CONSTANTS = {
  VALID_RANGES,
  MIN_CAPACITY,
  MAX_CAPACITY,
};
