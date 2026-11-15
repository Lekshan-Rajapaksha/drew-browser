import { IS_MACOS } from "./platformInfo";
import { keychainGet, keychainSet, keychainDelete } from "./keychain";

export async function credentialGet(account: string): Promise<string | null> {
  if (IS_MACOS) {
    return keychainGet(account);
  }
  return null;
}

export async function credentialSet(account: string, secret: string): Promise<void> {
  if (IS_MACOS) {
    return keychainSet(account, secret);
  }
}

export async function credentialDelete(account: string): Promise<void> {
  if (IS_MACOS) {
    return keychainDelete(account);
  }
}

