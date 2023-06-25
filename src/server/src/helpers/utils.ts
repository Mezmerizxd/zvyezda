import * as crypto from 'crypto';

export function hashPassword(password: string): string {
  const hash = crypto.createHash('sha512').update(password).digest('hex');
  return hash;
}
