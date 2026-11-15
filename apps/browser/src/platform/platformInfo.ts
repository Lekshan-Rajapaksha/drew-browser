export const IS_MACOS = typeof process !== 'undefined' && process.platform === 'darwin';
export const IS_WINDOWS = typeof process !== 'undefined' && process.platform === 'win32';
export const IS_LINUX = typeof process !== 'undefined' && process.platform === 'linux';

export type Platform = 'macos' | 'windows' | 'linux';

export const currentPlatform: Platform = IS_MACOS ? 'macos' : IS_WINDOWS ? 'windows' : 'linux';

