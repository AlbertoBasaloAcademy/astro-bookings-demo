import type { Launch, LaunchStatus } from '../types/launch';

export class LaunchStore {
  private launches: Map<string, Launch> = new Map();
  private nextId = 1;

  add(launch: Omit<Launch, 'id' | 'createdAt' | 'updatedAt'>): Launch {
    const id = `launch-${this.nextId++}`;
    const now = new Date();
    const newLaunch: Launch = {
      ...launch,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.launches.set(id, newLaunch);
    return newLaunch;
  }

  getById(id: string): Launch | undefined {
    return this.launches.get(id);
  }

  getAll(): Launch[] {
    return Array.from(this.launches.values());
  }

  update(id: string, updates: Partial<Omit<Launch, 'id' | 'createdAt'>>): Launch | undefined {
    const existing = this.launches.get(id);
    if (!existing) return undefined;

    const updated: Launch = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.launches.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.launches.delete(id);
  }

  clear(): void {
    this.launches.clear();
    this.nextId = 1;
  }
}

export const launchStore = new LaunchStore();
