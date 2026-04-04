const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptResult {
  ciphertext: string;
  salt: string;
  iv: string;
  version: number;
}

export async function encrypt(plaintext: string, password: string): Promise<EncryptResult> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    enc.encode(plaintext)
  );

  return {
    ciphertext: bufferToBase64(cipherBuffer),
    salt: bufferToBase64(salt.buffer),
    iv: bufferToBase64(iv.buffer),
    version: 1,
  };
}

export async function decrypt(
  ciphertext: string,
  password: string,
  saltB64: string,
  ivB64: string
): Promise<string> {
  const salt = new Uint8Array(base64ToBuffer(saltB64));
  const iv = new Uint8Array(base64ToBuffer(ivB64));
  const key = await deriveKey(password, salt);
  const cipherBuffer = base64ToBuffer(ciphertext);

  const plainBuffer = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    cipherBuffer
  );

  const dec = new TextDecoder();
  return dec.decode(plainBuffer);
}
