export interface SyncRecord {
  key: string;
  value: string;
  updatedAt: number;
  deviceId: string;
}

export interface SyncConflict {
  key: string;
  local: SyncRecord;
  remote: SyncRecord;
}

export type SyncState = 'idle' | 'syncing' | 'error' | 'disabled';

export interface SyncStatus {
  state: SyncState;
  lastSyncAt: number | null;
  error: string | null;
  folderPath: string | null;
}

export interface SyncEvents {
  change: (record: SyncRecord) => void;
  conflict: (conflict: SyncConflict) => void;
  error: (err: Error) => void;
}

