import type { Launch, CreateLaunchInput, UpdateLaunchInput } from '../types/launch';
import { launchStore } from './launchStore';

export class LaunchRepository {
  add(input: CreateLaunchInput): Launch {
    return launchStore.add({
      ...input,
      status: input.status || 'scheduled',
    });
  }

  getById(id: string): Launch | undefined {
    return launchStore.getById(id);
  }

  getAll(): Launch[] {
    return launchStore.getAll();
  }

  update(id: string, input: UpdateLaunchInput): Launch | undefined {
    return launchStore.update(id, input);
  }

  delete(id: string): boolean {
    return launchStore.delete(id);
  }

  getByRocketId(rocketId: string): Launch[] {
    return launchStore.getAll().filter((launch) => launch.rocketId === rocketId);
  }
}

export const launchRepository = new LaunchRepository();
