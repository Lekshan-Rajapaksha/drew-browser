import { nativeModule, type BangListReply } from "@ardia/shell";
import { configDirectory } from "./launchConfig";

const native = nativeModule("ArdiaDocuments");

const inMemoryStore = new Map<string, string>();

const getStoragePath = (name: string): string | null => {
  try {
    const dir = configDirectory();
    if (!dir) return null;
    const base = name.replace(/^.*[\\/]/, "");
    const sep = dir.includes("\\") ? "\\" : "/";
    return `${dir}${sep}${base}`;
  } catch {
    return null;
  }
};

const readLocalFile = (filepath: string): string | null => {
  try {
    if (typeof require !== "undefined") {
      const fs = require("fs");
      if (fs.existsSync(filepath)) {
        return fs.readFileSync(filepath, "utf8");
      }
    }
  } catch {
  }
  return null;
};

const writeLocalFile = (filepath: string, contents: string): void => {
  try {
    if (typeof require !== "undefined") {
      const fs = require("fs");
      const path = require("path");
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filepath, contents, "utf8");
    }
  } catch {
  }
};

const removeLocalFile = (filepath: string): void => {
  try {
    if (typeof require !== "undefined") {
      const fs = require("fs");
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
  } catch {
  }
};

export const readDocument = (name: string): string | null => {
  try {
    const res = native.readDocument(name);
    if (typeof res === "string" || res === null) {
      return res;
    }
  } catch {
  }
  if (inMemoryStore.has(name)) {
    return inMemoryStore.get(name) ?? null;
  }
  const filepath = getStoragePath(name);
  if (filepath) {
    const fileContent = readLocalFile(filepath);
    if (fileContent !== null) {
      inMemoryStore.set(name, fileContent);
      return fileContent;
    }
  }
  return null;
};

export const writeDocument = (name: string, contents: string): void => {
  inMemoryStore.set(name, contents);
  try {
    native.writeDocument(name, contents);
  } catch {
  }
  const filepath = getStoragePath(name);
  if (filepath) {
    writeLocalFile(filepath, contents);
  }
};

export const saveDocument = async (name: string, contents: string): Promise<void> => {
  writeDocument(name, contents);
  try {
    await native.saveDocument(name, contents);
  } catch {
  }
};

export const documentSaved = async (name: string): Promise<void> => {
  try {
    await native.documentSaved(name);
  } catch {
  }
};

export const removeDocument = (name: string): void => {
  inMemoryStore.delete(name);
  try {
    native.removeDocument(name);
  } catch {
  }
  const filepath = getStoragePath(name);
  if (filepath) {
    removeLocalFile(filepath);
  }
};

export const fetchBangList = async (etag: string | null): Promise<BangListReply> => {
  try {
    const reply = await nativeModule("ArdiaShell").fetchBangList(etag);
    if (reply && typeof reply === "object" && typeof reply.status === "number") {
      return reply;
    }
  } catch {
  }
  return { status: 304, etag: null, contentType: null, body: null, bytes: 0 };
};
