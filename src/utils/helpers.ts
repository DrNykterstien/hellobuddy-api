import bcrypt from 'bcryptjs';

export function trimAllSpaces(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}
