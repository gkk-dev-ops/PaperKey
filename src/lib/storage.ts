import { openDB, type IDBPDatabase } from 'idb';
import type { SecretEntry, PhoneticProfile } from '../types';

const DB_NAME = 'paperkey-db';
const DB_VERSION = 1;
const ENTRIES_STORE = 'entries';
const PROFILES_STORE = 'phonetic-profiles';

interface PaperKeyDB {
  [ENTRIES_STORE]: SecretEntry;
  [PROFILES_STORE]: PhoneticProfile;
}

let dbPromise: Promise<IDBPDatabase<PaperKeyDB>> | null = null;

function getDb(): Promise<IDBPDatabase<PaperKeyDB>> {
  if (!dbPromise) {
    dbPromise = openDB<PaperKeyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
          const entriesStore = db.createObjectStore(ENTRIES_STORE, { keyPath: 'id' });
          entriesStore.createIndex('createdAt', 'createdAt');
          entriesStore.createIndex('expiresAt', 'expiresAt');
        }
        if (!db.objectStoreNames.contains(PROFILES_STORE)) {
          db.createObjectStore(PROFILES_STORE, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveEntry(entry: SecretEntry): Promise<void> {
  const db = await getDb();
  await db.put(ENTRIES_STORE, entry);
}

export async function getEntry(id: string): Promise<SecretEntry | undefined> {
  const db = await getDb();
  return db.get(ENTRIES_STORE, id);
}

export async function getAllEntries(): Promise<SecretEntry[]> {
  const db = await getDb();
  const all = await db.getAll(ENTRIES_STORE);
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteEntry(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(ENTRIES_STORE, id);
}

export async function purgeAllEntries(): Promise<void> {
  const db = await getDb();
  await db.clear(ENTRIES_STORE);
}

export async function purgeExpiredEntries(): Promise<number> {
  const db = await getDb();
  const now = new Date().toISOString();
  const all = await db.getAll(ENTRIES_STORE);
  let count = 0;

  for (const entry of all) {
    if (entry.expiresAt && entry.expiresAt < now) {
      await db.delete(ENTRIES_STORE, entry.id);
      count++;
    }
  }

  return count;
}

// Phonetic profiles
export async function saveProfile(profile: PhoneticProfile): Promise<void> {
  const db = await getDb();
  await db.put(PROFILES_STORE, profile);
}

export async function getProfile(id: string): Promise<PhoneticProfile | undefined> {
  const db = await getDb();
  return db.get(PROFILES_STORE, id);
}

export async function getAllProfiles(): Promise<PhoneticProfile[]> {
  const db = await getDb();
  return db.getAll(PROFILES_STORE);
}

export async function deleteProfile(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(PROFILES_STORE, id);
}
