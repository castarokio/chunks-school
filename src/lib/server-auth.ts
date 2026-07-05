import type { NextRequest } from 'next/server';
import type { UserRole } from './types';
import { db } from './db';

export interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
}

export const adminRoles: UserRole[] = ['admin', 'admin_manager', 'owner'];
const elevatedRoles: UserRole[] = ['admin_manager', 'owner'];

export function getRequestUser(request: NextRequest): RequestUser | null {
  const id = request.headers.get('x-user-id');
  const email = request.headers.get('x-user-email') || '';
  const role = request.headers.get('x-user-role') as UserRole | null;

  if (!id || !role) return null;

  return { id, email, role };
}

export async function getCurrentUser(request: NextRequest): Promise<RequestUser | null> {
  const tokenUser = getRequestUser(request);
  if (!tokenUser) return null;

  const user = await db.user.findUnique({
    where: { id: tokenUser.id },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
  };
}

export function isAdminRole(role: string | null | undefined): boolean {
  return adminRoles.includes(role as UserRole);
}

export function canCreateRole(actorRole: string, targetRole: string): boolean {
  if (targetRole === 'owner') return actorRole === 'owner';
  if (targetRole === 'admin_manager') return elevatedRoles.includes(actorRole as UserRole);
  if (targetRole === 'admin') return elevatedRoles.includes(actorRole as UserRole);
  return isAdminRole(actorRole);
}

export function isTeacherOrAdminRole(role: string | null | undefined): boolean {
  return role === 'teacher' || isAdminRole(role);
}
