import { useState } from 'react';
import type { PhoneticProfile, SecretEntry, CharacterToken } from '../types';
import { tokenize } from '../lib/phonetic';
import { CharacterTable } from '../components/CharacterTable/CharacterTable';
import { PhoneticTable } from '../components/PhoneticTable/PhoneticTable';
import { navigate } from '../App';
import styles from './EntryDetail.module.css';

interface HistoryHook {
  entries: SecretEntry[];
  loading: boolean;
  refresh: () => Promise<void>;
  addEntry: (entry: SecretEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  purgeAll: () => Promise<void>;
}

interface EntryDetailProps {
  entry: SecretEntry;
  history: HistoryHook;
  activeProfile: PhoneticProfile;
}

type ViewMode = 'exact' | 'chars' | 'phonetic';

export default function EntryDetail({ entry, activeProfile }: EntryDetailProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('exact');
  const [showSecret, setShowSecret] = useState(false);

  const secret = entry.secretPlaintext ?? '';
  const tokens: CharacterToken[] = secret ? tokenize(secret, activeProfile) : [];

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back
        </button>
        <button
          className={styles.printBtn}
          onClick={() => navigate(`print/${entry.id}`)}
        >
          🖨 Print
        </button>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{entry.title ?? 'Untitled'}</h1>
        {entry.category && (
          <span className={styles.category}>{entry.category}</span>
        )}
      </div>

      <div className={styles.secretSection}>
        <div className={styles.secretHeader}>
          <span className={styles.sectionLabel}>Secret</span>
          <button
            className={styles.toggleBtn}
            onClick={() => setShowSecret((v) => !v)}
          >
            {showSecret ? '🙈 Hide' : '👁 Show'}
          </button>
        </div>
        <div
          className={styles.secretValue}
          style={{ filter: showSecret ? 'none' : 'blur(5px)' }}
          aria-label="Secret value"
        >
          {secret || <em style={{ opacity: 0.5 }}>Empty</em>}
        </div>
        <div className={styles.secretMeta}>{secret.length} characters</div>
      </div>

      {entry.notes && (
        <div className={styles.notes}>
          <span className={styles.sectionLabel}>Notes</span>
          <p className={styles.notesText}>{entry.notes}</p>
        </div>
      )}

      <div className={styles.viewTabs} role="tablist">
        {(['exact', 'chars', 'phonetic'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            role="tab"
            aria-selected={viewMode === mode}
            className={`${styles.tab} ${viewMode === mode ? styles.tabActive : ''}`}
            onClick={() => setViewMode(mode)}
          >
            {mode === 'exact' && 'Exact'}
            {mode === 'chars' && 'Characters'}
            {mode === 'phonetic' && 'Phonetic'}
          </button>
        ))}
      </div>

      <div className={styles.viewContent}>
        {viewMode === 'exact' && (
          <div className={styles.exactView}>
            <div
              className={styles.exactSecret}
              style={{ filter: showSecret ? 'none' : 'blur(5px)' }}
            >
              {secret}
            </div>
          </div>
        )}
        {viewMode === 'chars' && <CharacterTable tokens={tokens} />}
        {viewMode === 'phonetic' && (
          <div>
            <p className={styles.profileNote}>
              Using profile: <strong>{activeProfile.label}</strong>
            </p>
            <PhoneticTable tokens={tokens} />
          </div>
        )}
      </div>
    </div>
  );
}
