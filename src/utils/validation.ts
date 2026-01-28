import { CreateRocketInput, RocketRange } from '../types/rocket.js';
import { ValidationErrorDetail } from './error-handler.js';

const VALID_RANGES: RocketRange[] = ['suborbital', 'orbital', 'moon', 'mars'] as const;
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 10;

export function validateRocketInput(input: CreateRocketInput): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (!input.name || input.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required and cannot be empty' });
  }

  if (!VALID_RANGES.includes(input.range)) {
    errors.push({
      field: 'range',
      message: `Range must be one of: ${VALID_RANGES.join(', ')}`,
    });
  }

  if (
    !Number.isInteger(input.capacity) ||
    input.capacity < MIN_CAPACITY ||
    input.capacity > MAX_CAPACITY
  ) {
    errors.push({
      field: 'capacity',
      message: `Capacity must be an integer between ${MIN_CAPACITY} and ${MAX_CAPACITY}`,
    });
  }

  return errors;
}

export const ROCKET_STORE_CONSTANTS = {
  VALID_RANGES,
  MIN_CAPACITY,
  MAX_CAPACITY,
};
