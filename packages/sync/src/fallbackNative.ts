import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { FolderInfo, PhraseResult, SealedLogin } from "./native";
import type { Listing } from "./scopeState";

export function createFallbackSyncNative() {
  const getDevicePath = () => {
    const p = process.platform;
    if (p === "win32") {
      return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "Ardia", "Sync");
    }
    return path.join(os.homedir(), ".config", "ardia", "sync");
  };

  return {
    async folderInfo(targetPath: string | null): Promise<FolderInfo> {
      const def = getDevicePath();
      const p = targetPath || def;
      const exists = fs.existsSync(p);
      let hasSyncData = false;
      if (exists) {
        try {
          hasSyncData = fs.readdirSync(p).length > 0;
        } catch {}
      }
      return {
        path: p,
        defaultPath: def,
        iCloudAvailable: false,
        inICloud: false,
        exists,
        writable: true,
        hasSyncData,
      };
    },

    async chooseFolder(current: string | null): Promise<string | null> {
      return current || getDevicePath();
    },

    newDeviceId(): string {
      return "dev_" + Math.random().toString(36).slice(2, 12);
    },

    deviceName(): string {
      try {
        return os.hostname();
      } catch {
        return "Desktop";
      }
    },

    async createPhrase(account: string): Promise<boolean> {
      return true;
    },

    async enterPhrase(account: string, text: string, folder: string): Promise<PhraseResult> {
      return { ok: true };
    },

    async unlock(account: string): Promise<boolean> {
      return true;
    },

    async forget(account: string): Promise<void> {},

    async chainStatus(folder: string): Promise<"ok" | "missing" | "unavailable"> {
      return fs.existsSync(folder) ? "ok" : "missing";
    },

    async createChain(folder: string): Promise<void> {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
    },

    async write(folder: string, scope: string, payload: string): Promise<string> {
      const scopeDir = path.join(folder, scope);
      if (!fs.existsSync(scopeDir)) {
        fs.mkdirSync(scopeDir, { recursive: true });
      }
      const id = Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
      const filePath = path.join(scopeDir, `${id}.sync`);
      fs.writeFileSync(filePath, payload, "utf8");
      return id;
    },

    async read(folder: string, scope: string, known: string[]): Promise<Listing> {
      const scopeDir = path.join(folder, scope);
      if (!fs.existsSync(scopeDir)) {
        return { records: [], checkpoint: "" };
      }
      const files = fs.readdirSync(scopeDir).filter((f) => f.endsWith(".sync"));
      const records = files.map((file) => {
        const id = file.replace(/\.sync$/, "");
        const content = fs.readFileSync(path.join(scopeDir, file), "utf8");
        return { id, payload: content };
      });
      return { records, checkpoint: "" };
    },

    async remove(folder: string, scope: string, ids: string[]): Promise<void> {
      const scopeDir = path.join(folder, scope);
      for (const id of ids) {
        const f = path.join(scopeDir, `${id}.sync`);
        if (fs.existsSync(f)) {
          try {
            fs.unlinkSync(f);
          } catch {}
        }
      }
    },

    async deleteChain(folder: string): Promise<void> {
      if (fs.existsSync(folder)) {
        fs.rmSync(folder, { recursive: true, force: true });
      }
    },

    async sealLocal(text: string): Promise<string> {
      return Buffer.from(text, "utf8").toString("base64");
    },

    async openLocal(sealed: string): Promise<string | null> {
      try {
        return Buffer.from(sealed, "base64").toString("utf8");
      } catch {
        return null;
      }
    },

    async recoveryWords(): Promise<string[] | null> {
      return null;
    },

    async qrCode(): Promise<string | null> {
      return null;
    },

    async recoveryKitPreview(width: number): Promise<string | null> {
      return null;
    },

    async saveRecoveryKit(format: "pdf" | "text"): Promise<string | null> {
      return null;
    },

    async copyRecoveryKit(): Promise<boolean | null> {
      return null;
    },

    async shareRecoveryKit(): Promise<boolean | null> {
      return null;
    },

    async copyRecoveryPhrase(): Promise<boolean | null> {
      return null;
    },

    async revealFolder(folderPath: string): Promise<void> {},

    async readPasswords(engineProfile: string): Promise<SealedLogin[] | null> {
      return null;
    },

    async savePassword(
      engineProfile: string,
      origin: string,
      username: string,
      sealed: string,
      replacing: boolean
    ): Promise<boolean> {
      return false;
    },
  };
}

