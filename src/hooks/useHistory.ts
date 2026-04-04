import { useState, useCallback } from 'react';
import type { SecretEntry } from '../types';
import { getAllEntries, saveEntry, deleteEntry, purgeAllEntries } from '../lib/storage';
import { loadSettings } from '../lib/settings';

export function useHistory() {
  const [entries, setEntries] = useState<SecretEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const settings = loadSettings();
    if (!settings.historyEnabled) {
      setEntries([]);
      return;
    }
    setLoading(true);
    try {
      const all = await getAllEntries();
      setEntries(all);
    } catch (err) {
      console.warn('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = useCallback(async (entry: SecretEntry) => {
    const settings = loadSettings();
    if (entry.purgePolicy?.mode === 'never-store') return;
    if (!settings.historyEnabled) return;
    await saveEntry(entry);
    await refresh();
  }, [refresh]);

  const removeEntry = useCallback(async (id: string) => {
    await deleteEntry(id);
    await refresh();
  }, [refresh]);

  const purgeAll = useCallback(async () => {
    await purgeAllEntries();
    setEntries([]);
  }, []);

  return { entries, loading, refresh, addEntry, removeEntry, purgeAll };
}
