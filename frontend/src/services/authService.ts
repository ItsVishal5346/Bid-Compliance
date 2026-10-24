import { demoUsers } from '../data/mockData';
import type { User, UserRole } from '../types';

// Mock role selection only. A future backend must authenticate credentials and authorize every request.
export async function getDemoUser(role: UserRole): Promise<User> {
  return Promise.resolve({ ...demoUsers[role] });
}
