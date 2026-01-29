import { Response } from 'express';

const MIN_INT_PARAM = 1;

export type ValidationErrorDetail = {
  field: string;
  message: string;
};

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: ValidationErrorDetail[]
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(details: ValidationErrorDetail[]) {
    super(400, 'Validation error', details);
    this.name = 'ValidationError';
  }
}

export function handleError(error: unknown, res: Response): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      ...(error.details && { details: error.details }),
    });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}

export function parseIntParam(value: string | undefined, defaultValue: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  const safeValue = Number.isNaN(parsed) ? defaultValue : parsed;

  return Math.max(MIN_INT_PARAM, safeValue);
}

export function parseStringParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  return value?.[0];
}
