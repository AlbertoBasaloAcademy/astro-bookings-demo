/**
 * Domain entity - represents a resource as stored in the system
 */
export interface Resource {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'retired';
  capacity?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Request DTO for creating a new resource
 * Only includes fields that clients can set
 */
export interface CreateResourceRequest {
  name: string;
  status: 'active' | 'inactive' | 'retired';
  capacity?: number;
}

/**
 * Request DTO for updating an existing resource
 * All fields are optional - clients only send fields they want to change
 */
export interface UpdateResourceRequest {
  name?: string;
  status?: 'active' | 'inactive' | 'retired';
  capacity?: number;
}

/**
 * Validation error response format
 * Returned when validation fails (HTTP 400)
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  error: string;
  details?: unknown;
}
