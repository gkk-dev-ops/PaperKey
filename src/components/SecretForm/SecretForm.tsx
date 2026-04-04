import { useState, useId } from 'react';
import type { SecretEntry } from '../../types';
import styles from './SecretForm.module.css';

interface SecretFormProps {
  onSubmit: (entry: Omit<SecretEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  initial?: Partial<SecretEntry>;
  submitLabel?: string;
}

export function SecretForm({ onSubmit, onCancel, initial, submitLabel = 'Save & View' }: SecretFormProps) {
  const formId = useId();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [secret, setSecret] = useState(initial?.secretPlaintext ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [category, setCategory] = useState<SecretEntry['category']>(initial?.category ?? 'other');
  const [showSecret, setShowSecret] = useState(false);
  const [purgeMode, setPurgeMode] = useState<'never-store' | 'manual' | 'timed'>(
    initial?.purgePolicy?.mode ?? 'timed'
  );
  const [ttlSeconds, setTtlSeconds] = useState(initial?.purgePolicy?.ttlSeconds ?? 3600);

  const hasLeadingSpace = secret.startsWith(' ');
  const hasTrailingSpace = secret.endsWith(' ') && secret.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const expiresAt =
      purgeMode === 'timed' ? new Date(Date.now() + ttlSeconds * 1000).toISOString() : null;

    onSubmit({
      title: title.trim() || undefined,
      category,
      secretPlaintext: purgeMode !== 'never-store' ? secret : undefined,
      notes: notes.trim() || undefined,
      purgePolicy: { mode: purgeMode, ttlSeconds: purgeMode === 'timed' ? ttlSeconds : undefined },
      expiresAt,
      lastOpenedAt: now,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Secret entry form">
      <div className={styles.privacyBanner} role="alert">
        <span className={styles.privacyIcon}>&#128274;</span>
        <span>All data stays in this browser. Nothing is sent to any server.</span>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-title`} className={styles.label}>
          Title <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id={`${formId}-title`}
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Gmail backup codes"
          maxLength={200}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-category`} className={styles.label}>
          Category
        </label>
        <select
          id={`${formId}-category`}
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value as SecretEntry['category'])}
        >
          <option value="password">Password</option>
          <option value="recovery-code">Recovery Code</option>
          <option value="seed-fragment">Seed Fragment</option>
          <option value="api-key">API Key</option>
          <option value="wifi">Wi-Fi Password</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-secret`} className={styles.label}>
          Secret <span className={styles.required}>*</span>
        </label>
        <div className={styles.secretWrapper}>
          <textarea
            id={`${formId}-secret`}
            className={`${styles.textarea} ${styles.mono}`}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Paste your secret here..."
            rows={4}
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            style={{ filter: showSecret ? 'none' : 'blur(4px)' }}
          />
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowSecret((v) => !v)}
            aria-label={showSecret ? 'Hide secret' : 'Show secret'}
          >
            {showSecret ? '🙈 Hide' : '👁 Show'}
          </button>
        </div>
        <div className={styles.charInfo}>
          <span className={styles.charCount}>{secret.length} characters</span>
          {hasLeadingSpace && (
            <span className={styles.spaceWarning}>⚠ Leading space detected</span>
          )}
          {hasTrailingSpace && (
            <span className={styles.spaceWarning}>⚠ Trailing space detected</span>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-notes`} className={styles.label}>
          Notes <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id={`${formId}-notes`}
          className={styles.textarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Created 2024-01, stored in safe"
          rows={2}
        />
      </div>

      <div className={styles.field}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>Purge Policy</legend>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="timed"
                checked={purgeMode === 'timed'}
                onChange={() => setPurgeMode('timed')}
              />
              Auto-delete from history
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="manual"
                checked={purgeMode === 'manual'}
                onChange={() => setPurgeMode('manual')}
              />
              Keep until manually deleted
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="never-store"
                checked={purgeMode === 'never-store'}
                onChange={() => setPurgeMode('never-store')}
              />
              Never save to history
            </label>
          </div>
          {purgeMode === 'timed' && (
            <div className={styles.ttlRow}>
              <label htmlFor={`${formId}-ttl`} className={styles.labelInline}>
                Delete after:
              </label>
              <select
                id={`${formId}-ttl`}
                className={styles.selectSmall}
                value={ttlSeconds}
                onChange={(e) => setTtlSeconds(Number(e.target.value))}
              >
                <option value={900}>15 minutes</option>
                <option value={1800}>30 minutes</option>
                <option value={3600}>1 hour</option>
                <option value={7200}>2 hours</option>
                <option value={21600}>6 hours</option>
                <option value={86400}>24 hours</option>
                <option value={604800}>1 week</option>
              </select>
            </div>
          )}
        </fieldset>
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={!secret}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
