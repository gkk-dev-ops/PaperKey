import type { SecretEntry } from '../../types';
import styles from './HistoryList.module.css';

interface HistoryListProps {
  entries: SecretEntry[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onPurgeAll: () => void;
  loading?: boolean;
}

const CATEGORY_LABELS: Record<NonNullable<SecretEntry['category']>, string> = {
  password: 'Password',
  'recovery-code': 'Recovery Code',
  'seed-fragment': 'Seed Fragment',
  'api-key': 'API Key',
  wifi: 'Wi-Fi',
  other: 'Other',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ExpiryBadge({ entry }: { entry: SecretEntry }) {
  if (!entry.expiresAt) return null;
  const expiresAt = new Date(entry.expiresAt);
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMs < 0) {
    return <span className={`${styles.badge} ${styles.badgeExpired}`}>Expired</span>;
  }

  let label: string;
  if (diffMins < 60) {
    label = `Expires in ${diffMins}m`;
  } else if (diffMins < 1440) {
    label = `Expires in ${Math.round(diffMins / 60)}h`;
  } else {
    label = `Expires ${expiresAt.toLocaleDateString()}`;
  }

  const isUrgent = diffMs < 15 * 60 * 1000;
  return (
    <span className={`${styles.badge} ${isUrgent ? styles.badgeUrgent : styles.badgeExpiry}`}>
      {label}
    </span>
  );
}

export function HistoryList({ entries, onSelect, onDelete, onPurgeAll, loading }: HistoryListProps) {
  if (loading) {
    return <div className={styles.loading}>Loading history...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>No saved entries yet.</p>
        <p className={styles.emptyHint}>Entries you save will appear here.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Recent Entries</h2>
        <button
          className={styles.purgeBtn}
          onClick={onPurgeAll}
          aria-label="Delete all history entries"
        >
          Delete All
        </button>
      </div>
      <ul className={styles.list} role="list">
        {entries.map((entry) => (
          <li key={entry.id} className={styles.item}>
            <button
              className={styles.itemMain}
              onClick={() => onSelect(entry.id)}
              aria-label={`Open entry: ${entry.title ?? 'Untitled'}`}
            >
              <div className={styles.itemTop}>
                <span className={styles.itemTitle}>{entry.title ?? 'Untitled'}</span>
                {entry.category && (
                  <span className={styles.badge}>{CATEGORY_LABELS[entry.category]}</span>
                )}
                <ExpiryBadge entry={entry} />
              </div>
              <div className={styles.itemMeta}>
                <span className={styles.itemDate}>Created {formatDate(entry.createdAt)}</span>
                {entry.secretPlaintext && (
                  <span className={styles.itemLen}>
                    {entry.secretPlaintext.length} chars
                  </span>
                )}
              </div>
            </button>
            <button
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entry.id);
              }}
              aria-label={`Delete entry: ${entry.title ?? 'Untitled'}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
