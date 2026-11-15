import type { SyncRecord, SyncConflict } from './SyncTypes';

export function resolveConflict(conflict: SyncConflict): SyncRecord {
  if (conflict.local.updatedAt >= conflict.remote.updatedAt) {
    return conflict.local;
  }
  return conflict.remote;
}

export function mergeRecords(local: SyncRecord[], remote: SyncRecord[]): SyncRecord[] {
  const map = new Map<string, SyncRecord>();
  for (const r of local) {
    map.set(r.key, r);
  }
  for (const r of remote) {
    const existing = map.get(r.key);
    if (!existing) {
      map.set(r.key, r);
    } else {
      map.set(r.key, resolveConflict({ key: r.key, local: existing, remote: r }));
    }
  }
  return Array.from(map.values());
}

