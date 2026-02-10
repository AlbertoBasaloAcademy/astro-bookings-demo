import { CreateCustomerInput, UpdateCustomerInput } from '../types/customer.js';
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

const CUSTOMER_NAME_MIN_LENGTH = 2;
const CUSTOMER_NAME_MAX_LENGTH = 60;
const CUSTOMER_NAME_REGEX = /^[A-Za-z][A-Za-z '\-]*[A-Za-z]$/;
const CUSTOMER_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CUSTOMER_PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

type EmailLookup = (email: string) => { id: string } | undefined;

function addCustomerError(
  errors: ValidationErrorDetail[],
  field: string,
  message: string
): void {
  errors.push({ field, message });
}

export function validateCustomerInput(input: CreateCustomerInput): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];
  const name = input.name?.trim();
  const email = input.email?.trim();
  const phone = input.phone?.trim();

  if (!name) {
    addCustomerError(errors, 'name', 'Name is required and cannot be empty');
  } else if (name.length < CUSTOMER_NAME_MIN_LENGTH || name.length > CUSTOMER_NAME_MAX_LENGTH) {
    addCustomerError(
      errors,
      'name',
      `Name must be between ${CUSTOMER_NAME_MIN_LENGTH} and ${CUSTOMER_NAME_MAX_LENGTH} characters`
    );
  } else if (!CUSTOMER_NAME_REGEX.test(name)) {
    addCustomerError(errors, 'name', 'Name contains invalid characters');
  }

  if (!email) {
    addCustomerError(errors, 'email', 'Email is required and cannot be empty');
  } else if (!CUSTOMER_EMAIL_REGEX.test(email)) {
    addCustomerError(errors, 'email', 'Email format is invalid');
  }

  if (!phone) {
    addCustomerError(errors, 'phone', 'Phone is required and cannot be empty');
  } else if (!CUSTOMER_PHONE_REGEX.test(phone)) {
    addCustomerError(errors, 'phone', 'Phone format is invalid');
  }

  return errors;
}

export function validateCustomerUpdateInput(
  input: UpdateCustomerInput & { email?: string }
): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (input.email !== undefined) {
    addCustomerError(errors, 'email', 'Email cannot be updated');
  }

  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) {
      addCustomerError(errors, 'name', 'Name is required and cannot be empty');
    } else if (name.length < CUSTOMER_NAME_MIN_LENGTH || name.length > CUSTOMER_NAME_MAX_LENGTH) {
      addCustomerError(
        errors,
        'name',
        `Name must be between ${CUSTOMER_NAME_MIN_LENGTH} and ${CUSTOMER_NAME_MAX_LENGTH} characters`
      );
    } else if (!CUSTOMER_NAME_REGEX.test(name)) {
      addCustomerError(errors, 'name', 'Name contains invalid characters');
    }
  }

  if (input.phone !== undefined) {
    const phone = input.phone.trim();
    if (!phone) {
      addCustomerError(errors, 'phone', 'Phone is required and cannot be empty');
    } else if (!CUSTOMER_PHONE_REGEX.test(phone)) {
      addCustomerError(errors, 'phone', 'Phone format is invalid');
    }
  }

  return errors;
}

export function validateEmailUniqueness(
  email: string,
  lookup: EmailLookup,
  currentId?: string
): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];
  const normalized = email.trim().toLowerCase();
  const existing = lookup(normalized);

  if (existing && existing.id !== currentId) {
    addCustomerError(errors, 'email', 'Email must be unique');
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
