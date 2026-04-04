import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock idb since it's not available in jsdom
vi.mock('idb', () => {
  const store = new Map<string, unknown>();
  const profileStore = new Map<string, unknown>();

  const mockDb = {
    put: vi.fn(async (storeName: string, value: { id: string }) => {
      if (storeName === 'entries') store.set(value.id, value);
      else profileStore.set(value.id, value);
    }),
    get: vi.fn(async (storeName: string, key: string) => {
      if (storeName === 'entries') return store.get(key);
      return profileStore.get(key);
    }),
    getAll: vi.fn(async (storeName: string) => {
      if (storeName === 'entries') return Array.from(store.values());
      return Array.from(profileStore.values());
    }),
    delete: vi.fn(async (storeName: string, key: string) => {
      if (storeName === 'entries') store.delete(key);
      else profileStore.delete(key);
    }),
    clear: vi.fn(async (storeName: string) => {
      if (storeName === 'entries') store.clear();
      else profileStore.clear();
    }),
  };

  return {
    openDB: vi.fn(async () => mockDb),
  };
});

import { saveEntry, getEntry, getAllEntries, deleteEntry, purgeAllEntries, purgeExpiredEntries } from '../../src/lib/storage';
import type { SecretEntry } from '../../src/types';

function makeEntry(overrides: Partial<SecretEntry> = {}): SecretEntry {
  const now = new Date().toISOString();
  return {
    id: `test-${Math.random().toString(36).slice(2)}`,
    title: 'Test Entry',
    secretPlaintext: 'mysecret',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('storage', () => {
  beforeEach(async () => {
    await purgeAllEntries();
  });

  it('saves and retrieves an entry', async () => {
    const entry = makeEntry({ id: 'test-1' });
    await saveEntry(entry);
    const retrieved = await getEntry('test-1');
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe('test-1');
    expect(retrieved?.title).toBe('Test Entry');
  });

  it('returns undefined for missing entry', async () => {
    const result = await getEntry('nonexistent');
    expect(result).toBeUndefined();
  });

  it('gets all entries', async () => {
    const e1 = makeEntry({ id: 'e1' });
    const e2 = makeEntry({ id: 'e2' });
    await saveEntry(e1);
    await saveEntry(e2);
    const all = await getAllEntries();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it('deletes an entry', async () => {
    const entry = makeEntry({ id: 'del-1' });
    await saveEntry(entry);
    await deleteEntry('del-1');
    const retrieved = await getEntry('del-1');
    expect(retrieved).toBeUndefined();
  });

  it('purges all entries', async () => {
    await saveEntry(makeEntry({ id: 'pa-1' }));
    await saveEntry(makeEntry({ id: 'pa-2' }));
    await purgeAllEntries();
    const all = await getAllEntries();
    expect(all).toHaveLength(0);
  });

  it('purges expired entries', async () => {
    const past = new Date(Date.now() - 1000).toISOString();
    const future = new Date(Date.now() + 100000).toISOString();

    const expired = makeEntry({ id: 'exp-1', expiresAt: past });
    const valid = makeEntry({ id: 'exp-2', expiresAt: future });

    await saveEntry(expired);
    await saveEntry(valid);

    const count = await purgeExpiredEntries();
    expect(count).toBeGreaterThanOrEqual(1);

    const retrieved = await getEntry('exp-1');
    expect(retrieved).toBeUndefined();
  });
});
