import type { CreateLaunchInput, Launch, LaunchStatus, UpdateLaunchInput } from '../types/launch.js';
import { ValidationError } from '../utils/error-handler.js';
import { debug } from '../utils/logger.js';
import { launchRepository } from './launch.repository.js';
import { rocketStore } from './rocketStore.js';

type ValidationIssue = { field: string; message: string };

const VALID_LAUNCH_STATUSES: ReadonlySet<LaunchStatus> = new Set(['scheduled', 'active', 'completed', 'cancelled']);

const ALLOWED_STATUS_TRANSITIONS: Record<LaunchStatus, ReadonlySet<LaunchStatus>> = {
  scheduled: new Set(['active', 'cancelled']),
  active: new Set(['completed', 'cancelled']),
  completed: new Set(),
  cancelled: new Set(),
};

export class LaunchService {
  create(input: CreateLaunchInput): Launch {
    const errors = this.validateLaunchInput(input);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const launch = launchRepository.add(input);
    debug('Launch created', {
      id: launch.id,
      rocketId: launch.rocketId,
      scheduledDate: launch.scheduledDate,
      price: launch.price,
    });
    return launch;
  }

  getById(id: string): Launch | undefined {
    return launchRepository.getById(id);
  }

  getAll(): Launch[] {
    return launchRepository.getAll();
  }

  update(id: string, input: UpdateLaunchInput): Launch | undefined {
    const existing = launchRepository.getById(id);
    if (!existing) return undefined;

    const errors = this.validateLaunchUpdate(existing, input);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const updated = launchRepository.update(id, input);
    if (updated) {
      debug('Launch updated', { id, status: updated.status });
    }
    return updated;
  }

  delete(id: string): boolean {
    return launchRepository.delete(id);
  }

  getByRocketId(rocketId: string): Launch[] {
    return launchRepository.getByRocketId(rocketId);
  }

  private validateLaunchInput(input: CreateLaunchInput): ValidationIssue[] {
    const errors: ValidationIssue[] = [];

    // Validate rocketId exists
    const rocket = rocketStore.getById(input.rocketId);
    if (!rocket) {
      errors.push({ field: 'rocketId', message: 'Rocket not found' });
      return errors; // Return early since we need rocket info for other validations
    }

    // Validate minimum_passengers >= 1
    if (!Number.isInteger(input.minimumPassengers) || input.minimumPassengers < 1) {
      errors.push({ field: 'minimumPassengers', message: 'Minimum passengers must be at least 1' });
    }

    // Validate minimum_passengers <= rocket capacity
    if (input.minimumPassengers > rocket.capacity) {
      errors.push({
        field: 'minimumPassengers',
        message: `Minimum passengers cannot exceed rocket capacity of ${rocket.capacity}`,
      });
    }

    // Validate scheduledDate is in the future
    const now = new Date();
    const scheduledDate = new Date(input.scheduledDate);
    if (isNaN(scheduledDate.getTime())) {
      errors.push({ field: 'scheduledDate', message: 'Invalid date format' });
    } else if (scheduledDate <= now) {
      errors.push({ field: 'scheduledDate', message: 'Scheduled date must be in the future' });
    }

    // Validate price > 0
    if (!Number.isFinite(input.price) || input.price <= 0) {
      errors.push({ field: 'price', message: 'Price must be greater than 0' });
    }

    return errors;
  }

  private validateLaunchUpdate(existing: Launch, input: UpdateLaunchInput): ValidationIssue[] {
    const errors: ValidationIssue[] = [];

    if (input.status === undefined) {
      return errors;
    }

    if (!this.isLaunchStatus(input.status)) {
      errors.push({ field: 'status', message: 'Invalid launch status' });
      return errors;
    }

    // Idempotent updates are allowed when no state change is requested.
    if (input.status === existing.status) {
      return errors;
    }

    if (!this.isAllowedStatusTransition(existing.status, input.status)) {
      errors.push({
        field: 'status',
        message: `Invalid status transition from ${existing.status} to ${input.status}`,
      });
    }

    return errors;
  }

  private isLaunchStatus(value: string): value is LaunchStatus {
    return VALID_LAUNCH_STATUSES.has(value as LaunchStatus);
  }

  private isAllowedStatusTransition(from: LaunchStatus, to: LaunchStatus): boolean {
    return ALLOWED_STATUS_TRANSITIONS[from].has(to);
  }
}

export const launchService = new LaunchService();
