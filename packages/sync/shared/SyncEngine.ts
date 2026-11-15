import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';
import type { SyncRecord, SyncStatus, SyncState } from './SyncTypes';
import { getDeviceId } from './DeviceId';
import { getSyncFolderPath, ensureSyncFolder } from './SyncFolder';
import { deriveKey, encryptRecord, decryptRecord } from './Encryption';

export class SyncEngine extends EventEmitter {
  private folder: string;
  private key: Buffer | null = null;
  private deviceId: string;
  private state: SyncState = 'idle';
  private watcher: fs.FSWatcher | null = null;
  private lastSyncAt: number | null = null;
  private error: string | null = null;

  constructor(folder: string = getSyncFolderPath(), passphrase?: string) {
    super();
    this.folder = folder;
    this.deviceId = getDeviceId();
    if (passphrase) {
      this.key = deriveKey(passphrase);
    }
  }

  public async start(): Promise<void> {
    ensureSyncFolder(this.folder);
    this.state = 'idle';

    try {
      this.watcher = fs.watch(this.folder, (eventType, filename) => {
        if (filename && filename.endsWith('.sync.json')) {
          this.emit('change', filename);
        }
      });
    } catch (e: any) {
      this.state = 'error';
      this.error = e?.message || 'Watch failed';
    }
  }

  public stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    this.state = 'disabled';
  }

  public async get(key: string): Promise<SyncRecord | null> {
    const filePath = path.join(this.folder, `${key}.sync.json`);
    if (!fs.existsSync(filePath)) return null;

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (this.key) {
        return decryptRecord(content, this.key);
      }
      return JSON.parse(content) as SyncRecord;
    } catch {
      return null;
    }
  }

  public async set(key: string, value: string): Promise<void> {
    ensureSyncFolder(this.folder);
    const record: SyncRecord = {
      key,
      value,
      updatedAt: Date.now(),
      deviceId: this.deviceId,
    };

    const filePath = path.join(this.folder, `${key}.sync.json`);
    const content = this.key ? encryptRecord(record, this.key) : JSON.stringify(record, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
    this.lastSyncAt = Date.now();
  }

  public async delete(key: string): Promise<void> {
    const filePath = path.join(this.folder, `${key}.sync.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.lastSyncAt = Date.now();
    }
  }

  public status(): SyncStatus {
    return {
      state: this.state,
      lastSyncAt: this.lastSyncAt,
      error: this.error,
      folderPath: this.folder,
    };
  }
}

