import { CreateBookingInput } from '../types/booking.js';
import { CreateCustomerInput, UpdateCustomerInput } from '../types/customer.js';
import { CreateRocketInput, RocketRange } from '../types/rocket.js';
import { ValidationErrorDetail } from './error-handler.js';

const VALID_RANGES: RocketRange[] = ['suborbital', 'orbital', 'moon', 'mars'] as const;
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 10;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

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

const CUSTOMER_NAME_MIN_LENGTH = 2;
const CUSTOMER_NAME_MAX_LENGTH = 60;
const CUSTOMER_NAME_REGEX = /^[A-Za-z][A-Za-z '\-]*[A-Za-z]$/;
const CUSTOMER_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CUSTOMER_PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

function validateName(name: string | undefined, errors: ValidationErrorDetail[]): void {
  const trimmedName = name?.trim();
  
  if (!trimmedName) {
    errors.push({ field: 'name', message: 'Name is required and cannot be empty' });
  } else if (trimmedName.length < CUSTOMER_NAME_MIN_LENGTH || trimmedName.length > CUSTOMER_NAME_MAX_LENGTH) {
    errors.push({
      field: 'name',
      message: `Name must be between ${CUSTOMER_NAME_MIN_LENGTH} and ${CUSTOMER_NAME_MAX_LENGTH} characters`
    });
  } else if (!CUSTOMER_NAME_REGEX.test(trimmedName)) {
    errors.push({ field: 'name', message: 'Name contains invalid characters' });
  }
}

function validatePhone(phone: string | undefined, errors: ValidationErrorDetail[]): void {
  const trimmedPhone = phone?.trim();
  
  if (!trimmedPhone) {
    errors.push({ field: 'phone', message: 'Phone is required and cannot be empty' });
  } else if (!CUSTOMER_PHONE_REGEX.test(trimmedPhone)) {
    errors.push({ field: 'phone', message: 'Phone format is invalid' });
  }
}

export function validateCustomerInput(input: CreateCustomerInput): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];
  const email = input.email?.trim();

  validateName(input.name, errors);

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required and cannot be empty' });
  } else if (!CUSTOMER_EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'Email format is invalid' });
  }

  validatePhone(input.phone, errors);

  return errors;
}

export function validateCustomerUpdateInput(
  input: UpdateCustomerInput & { email?: string }
): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (input.email !== undefined) {
    errors.push({ field: 'email', message: 'Email cannot be updated' });
  }

  if (input.name !== undefined) {
    validateName(input.name, errors);
  }

  if (input.phone !== undefined) {
    validatePhone(input.phone, errors);
  }

  return errors;
}

export const CUSTOMER_VALIDATION_CONSTANTS = {
  CUSTOMER_NAME_MIN_LENGTH,
  CUSTOMER_NAME_MAX_LENGTH,
  CUSTOMER_NAME_REGEX,
  CUSTOMER_EMAIL_REGEX,
  CUSTOMER_PHONE_REGEX,
};

const MIN_SEAT_COUNT = 1;

export function validateBookingInput(input: CreateBookingInput): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  // Validate launchId
  if (!input.launchId || typeof input.launchId !== 'string' || input.launchId.trim() === '') {
    errors.push({ field: 'launchId', message: 'Launch ID is required' });
  }

  // Validate customerEmail
  const email = input.customerEmail?.trim();
  if (!email) {
    errors.push({ field: 'customerEmail', message: 'Customer email is required' });
  } else if (!CUSTOMER_EMAIL_REGEX.test(email)) {
    errors.push({ field: 'customerEmail', message: 'Customer email format is invalid' });
  }

  // Validate seatCount
  if (!Number.isInteger(input.seatCount) || input.seatCount < MIN_SEAT_COUNT) {
    errors.push({
      field: 'seatCount',
      message: `Seat count must be an integer >= ${MIN_SEAT_COUNT}`,
    });
  }

  return errors;
}

export const BOOKING_VALIDATION_CONSTANTS = {
  MIN_SEAT_COUNT,
};
