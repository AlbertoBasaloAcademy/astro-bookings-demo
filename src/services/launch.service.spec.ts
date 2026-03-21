import { beforeEach, describe, expect, it } from 'vitest';
import type { LaunchStatus } from '../types/launch.js';
import { ValidationError } from '../utils/error-handler.js';
import { LaunchService } from './launch.service.js';
import { launchStore } from './launchStore.js';

function createStoredLaunch(status: LaunchStatus = 'scheduled') {
  return launchStore.add({
    rocketId: 'rocket-seeded',
    scheduledDate: new Date('2099-01-01T00:00:00.000Z'),
    price: 120,
    minimumPassengers: 2,
    status,
  });
}

describe('LaunchService lifecycle guards', () => {
  let service: LaunchService;

  const expectTransitionAccepted = (from: LaunchStatus, to: LaunchStatus) => {
    const launch = createStoredLaunch(from);

    const result = service.update(launch.id, { status: to });

    expect(result?.status).toBe(to);
  };

  const expectTransitionRejected = (from: LaunchStatus, to: LaunchStatus) => {
    const launch = createStoredLaunch(from);

    expect(() => service.update(launch.id, { status: to })).toThrow(ValidationError);
    expect(service.getById(launch.id)?.status).toBe(from);
  };

  beforeEach(() => {
    launchStore.clear();
    service = new LaunchService();
  });

  it('accepts scheduled to active', () => {
    expectTransitionAccepted('scheduled', 'active');
  });

  it('accepts scheduled to cancelled', () => {
    expectTransitionAccepted('scheduled', 'cancelled');
  });

  it('accepts active to completed', () => {
    expectTransitionAccepted('active', 'completed');
  });

  it('accepts active to cancelled', () => {
    expectTransitionAccepted('active', 'cancelled');
  });

  it('rejects scheduled to completed', () => {
    expectTransitionRejected('scheduled', 'completed');
  });

  it('rejects active to scheduled', () => {
    expectTransitionRejected('active', 'scheduled');
  });

  it('rejects any transition from completed', () => {
    expectTransitionRejected('completed', 'active');
  });

  it('rejects any transition from cancelled', () => {
    expectTransitionRejected('cancelled', 'active');
  });

  it('rejects unknown status values', () => {
    const launch = createStoredLaunch('scheduled');

    expect(() => service.update(launch.id, { status: 'boarding' as LaunchStatus })).toThrow(ValidationError);
    expect(service.getById(launch.id)?.status).toBe('scheduled');
  });

  it('updates mutable fields when status is absent', () => {
    const launch = createStoredLaunch('completed');
    const previousUpdatedAt = launch.updatedAt.getTime();

    const result = service.update(launch.id, { price: 250, minimumPassengers: 3 });

    expect(result?.status).toBe('completed');
    expect(result?.price).toBe(250);
    expect(result?.minimumPassengers).toBe(3);
    expect((result?.updatedAt.getTime() ?? 0) >= previousUpdatedAt).toBe(true);
  });
});