import { InMemoryRocketRepository } from './rocket.repository.js';
import { RocketService } from './rocket.service.js';

const repository = new InMemoryRocketRepository();
export const rocketStore = new RocketService(repository);
