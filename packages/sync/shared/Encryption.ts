import * as crypto from 'crypto';
import type { SyncRecord } from './SyncTypes';

export function deriveKey(passphrase: string, salt: string = 'ardia-sync-salt'): Buffer {
  return crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
}

export function encryptRecord(record: SyncRecord, key: Buffer): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = JSON.stringify(record);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return JSON.stringify({
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    ciphertext: encrypted,
  });
}

export function decryptRecord(payloadStr: string, key: Buffer): SyncRecord | null {
  try {
    const { iv, authTag, ciphertext } = JSON.parse(payloadStr);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted) as SyncRecord;
  } catch {
    return null;
  }
}

