export type CipherAlgo = "AES-GCM" | "AES-CBC";

export interface EncryptedVaultBlob {
  algo?: CipherAlgo;
  saltB64: string;
  ivB64: string;
  cipherB64: string;
  recoverySaltB64?: string;
  recoveryIvB64?: string;
  recoveryCipherB64?: string;
  updatedAt: string;
}

const toB64 = (buf: ArrayBuffer | Uint8Array): string => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
};

const fromB64 = (b64: string): Uint8Array => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

async function deriveKey(secret: string, salt: Uint8Array, algo: CipherAlgo): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt.buffer as ArrayBuffer, iterations: 250000, hash: "SHA-256" },
    baseKey,
    { name: algo, length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptVaultJson(plainText: string, passphrase: string, algo: CipherAlgo = "AES-GCM", recoveryCode?: string): Promise<EncryptedVaultBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(algo === "AES-GCM" ? 12 : 16));
  const key = await deriveKey(passphrase, salt, algo);
  const cipher = await crypto.subtle.encrypt({ name: algo, iv: iv.buffer as ArrayBuffer }, key, new TextEncoder().encode(plainText));
  const blob: EncryptedVaultBlob = { algo, saltB64: toB64(salt), ivB64: toB64(iv), cipherB64: toB64(cipher), updatedAt: new Date().toISOString() };
  if (recoveryCode && recoveryCode.trim().length >= 12) {
    const rSalt = crypto.getRandomValues(new Uint8Array(16));
    const rIv = crypto.getRandomValues(new Uint8Array(12));
    const rKey = await deriveKey(recoveryCode.trim(), rSalt, "AES-GCM");
    const rCipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: rIv.buffer as ArrayBuffer }, rKey, new TextEncoder().encode(plainText));
    blob.recoverySaltB64 = toB64(rSalt); blob.recoveryIvB64 = toB64(rIv); blob.recoveryCipherB64 = toB64(rCipher);
  }
  return blob;
}

export async function decryptVaultJson(blob: EncryptedVaultBlob, passphrase: string): Promise<string> {
  const algo: CipherAlgo = blob.algo || "AES-GCM";
  const key = await deriveKey(passphrase, fromB64(blob.saltB64), algo);
  const plainBuf = await crypto.subtle.decrypt({ name: algo, iv: fromB64(blob.ivB64).buffer as ArrayBuffer }, key, fromB64(blob.cipherB64).buffer as ArrayBuffer);
  return new TextDecoder().decode(plainBuf);
}

export async function recoverVaultWithCode(blob: EncryptedVaultBlob, recoveryCode: string): Promise<string> {
  if (!blob.recoverySaltB64 || !blob.recoveryIvB64 || !blob.recoveryCipherB64) throw new Error("NO_RECOVERY_BLOB");
  const rKey = await deriveKey(recoveryCode.trim(), fromB64(blob.recoverySaltB64), "AES-GCM");
  const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(blob.recoveryIvB64).buffer as ArrayBuffer }, rKey, fromB64(blob.recoveryCipherB64).buffer as ArrayBuffer);
  return new TextDecoder().decode(plainBuf);
}
