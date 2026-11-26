export interface EncryptedVaultBlob {
  saltB64: string;
  ivB64: string;
  cipherB64: string;
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

async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt.buffer as ArrayBuffer, iterations: 250000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptVaultJson(plainText: string, passphrase: string): Promise<EncryptedVaultBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(passphrase, salt);
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv.buffer as ArrayBuffer }, key, new TextEncoder().encode(plainText));
  return { saltB64: toB64(salt), ivB64: toB64(iv), cipherB64: toB64(cipher), updatedAt: new Date().toISOString() };
}

export async function decryptVaultJson(blob: EncryptedVaultBlob, passphrase: string): Promise<string> {
  const key = await deriveAesKey(passphrase, fromB64(blob.saltB64));
  const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(blob.ivB64).buffer as ArrayBuffer }, key, fromB64(blob.cipherB64).buffer as ArrayBuffer);
  return new TextDecoder().decode(plainBuf);
}
