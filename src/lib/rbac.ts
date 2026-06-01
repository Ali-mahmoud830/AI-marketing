import { UserRole } from '@/types';

// In a real application, this would verify a JWT or Session token.
// For this SaaS refactor, we are simulating an active session.

export async function getCurrentUserRole(): Promise<UserRole> {
  // Mocking the SuperAdmin role for development/dashboard access
  return 'SuperAdmin';
}

export function canAccessSettings(role: UserRole): boolean {
  return role === 'SuperAdmin';
}

export function canAccessMarketing(role: UserRole): boolean {
  return role === 'SuperAdmin';
}

export function canAccessPipeline(role: UserRole): boolean {
  // Sales and CRM can only access the Pipeline
  return role === 'SuperAdmin' || role === 'Sales' || role === 'CRM';
}
