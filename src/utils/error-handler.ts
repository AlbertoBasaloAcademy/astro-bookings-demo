import { Response } from 'express';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: ValidationErrorDetail[]
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
  return Math.max(1, parseInt(value || '', 10) || defaultValue);
}

export function parseStringParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
