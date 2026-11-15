import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export function getSyncFolderPath(): string {
  const p = process.platform;
  if (p === 'win32') {
    return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'Ardia', 'Sync');
  } else if (p === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Mobile Documents', 'iCloud~dev~ardia', 'Documents');
  } else {
    return path.join(os.homedir(), '.config', 'ardia', 'sync');
  }
}

export function ensureSyncFolder(folderPath: string = getSyncFolderPath()): void {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

