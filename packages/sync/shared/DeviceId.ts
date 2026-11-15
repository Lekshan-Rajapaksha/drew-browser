import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export function getDeviceId(): string {
  const p = process.platform;
  let dir = '';
  if (p === 'win32') {
    dir = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'Ardia');
  } else if (p === 'darwin') {
    dir = path.join(os.homedir(), 'Library', 'Application Support', 'Ardia');
  } else {
    dir = path.join(os.homedir(), '.config', 'ardia');
  }

  const file = path.join(dir, 'device-id');
  try {
    if (fs.existsSync(file)) {
      const id = fs.readFileSync(file, 'utf8').trim();
      if (id) return id;
    }
  } catch {}

  const newId = 'dev_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, newId, 'utf8');
  } catch {}
  return newId;
}

