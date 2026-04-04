import { useCallback } from 'react';
import type { AppSettings, PhoneticProfile, SecretEntry } from '../types';
import { SecretForm } from '../components/SecretForm/SecretForm';
import { HistoryList } from '../components/HistoryList/HistoryList';
import { navigate } from '../App';

interface HistoryHook {
  entries: SecretEntry[];
  loading: boolean;
  refresh: () => Promise<void>;
  addEntry: (entry: SecretEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  purgeAll: () => Promise<void>;
}

interface HomeProps {
  settings: AppSettings;
  history: HistoryHook;
  activeProfile: PhoneticProfile;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function Home({ settings, history }: HomeProps) {
  const handleSubmit = useCallback(
    async (data: Omit<SecretEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const id = generateId();

      const entry: SecretEntry = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
        phoneticProfileId: settings.activePhoneticProfileId,
      };

      if (entry.purgePolicy?.mode !== 'never-store' && settings.historyEnabled) {
        await history.addEntry(entry);
      } else {
        // Save to sessionStorage so the entry detail page can load it
        sessionStorage.setItem(`paperkey-entry-${id}`, JSON.stringify(entry));
      }

      navigate(`entry/${id}`);
    },
    [settings, history]
  );

  const handleDeleteAll = useCallback(async () => {
    if (confirm('Delete all history entries? This cannot be undone.')) {
      await history.purgeAll();
    }
  }, [history]);

  return (
    <div>
      <section aria-labelledby="form-heading">
        <h1
          id="form-heading"
          style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1.25rem', marginTop: 0 }}
        >
          New Secret Backup Sheet
        </h1>
        <SecretForm onSubmit={handleSubmit} />
      </section>

      <hr
        style={{
          margin: '2rem 0',
          border: 'none',
          borderTop: '1px solid var(--color-border)',
        }}
      />

      <section aria-labelledby="history-heading">
        <HistoryList
          entries={history.entries}
          loading={history.loading}
          onSelect={(id) => navigate(`entry/${id}`)}
          onDelete={(id) => history.removeEntry(id)}
          onPurgeAll={handleDeleteAll}
        />
      </section>
    </div>
  );
}
