import { useState, useEffect } from 'react';
import type { AppSettings, PhoneticProfile } from '../../types';
import { loadSettings, saveSettings } from '../../lib/settings';
import { saveProfile, deleteProfile } from '../../lib/storage';
import { NATO_PROFILE } from '../../lib/phonetic';
import styles from './Settings.module.css';

interface SettingsProps {
  profiles: PhoneticProfile[];
  onProfilesChange: () => void;
}

function generateId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function Settings({ profiles, onProfilesChange }: SettingsProps) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [saved, setSaved] = useState(false);
  const buildVersion = import.meta.env.VITE_APP_VERSION ?? 'dev';

  // New custom profile form
  const [newProfileLabel, setNewProfileLabel] = useState('');
  const [editingProfile, setEditingProfile] = useState<PhoneticProfile | null>(null);
  const [editJson, setEditJson] = useState('');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    saveSettings(settings);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [settings]);

  const handleCreateProfile = () => {
    if (!newProfileLabel.trim()) return;
    const base = { ...NATO_PROFILE };
    const profile: PhoneticProfile = {
      ...base,
      id: generateId(),
      label: newProfileLabel.trim(),
      source: 'user-custom',
    };
    setNewProfileLabel('');
    setEditingProfile(profile);
    setEditJson(JSON.stringify({ letters: profile.letters, digits: profile.digits, symbols: profile.symbols }, null, 2));
    setEditError('');
  };

  const handleEditProfile = (profile: PhoneticProfile) => {
    setEditingProfile(profile);
    setEditJson(
      JSON.stringify(
        { letters: profile.letters, digits: profile.digits, symbols: profile.symbols },
        null,
        2
      )
    );
    setEditError('');
  };

  const handleSaveProfile = async () => {
    if (!editingProfile) return;
    try {
      const parsed = JSON.parse(editJson) as {
        letters: Record<string, string>;
        digits: Record<string, string>;
        symbols: Record<string, string>;
      };
      const updated: PhoneticProfile = {
        ...editingProfile,
        letters: parsed.letters ?? editingProfile.letters,
        digits: parsed.digits ?? editingProfile.digits,
        symbols: parsed.symbols ?? editingProfile.symbols,
      };
      await saveProfile(updated);
      onProfilesChange();
      setEditingProfile(null);
      setEditJson('');
    } catch (e) {
      setEditError(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    await deleteProfile(id);
    onProfilesChange();
    if (settings.activePhoneticProfileId === id) {
      setSettings((prev) => ({ ...prev, activePhoneticProfileId: 'nato' }));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>History</h2>

        <div className={styles.field}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.historyEnabled}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, historyEnabled: e.target.checked }))
              }
            />
            <span className={styles.toggleLabel}>Save entries to history</span>
          </label>
          <p className={styles.hint}>
            When enabled, entries are stored in IndexedDB in this browser only.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Default purge policy</label>
          <div className={styles.radioGroup}>
            {(['timed', 'manual', 'never-store'] as const).map((mode) => (
              <label key={mode} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="purge-mode"
                  value={mode}
                  checked={settings.defaultPurgePolicy.mode === mode}
                  onChange={() =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultPurgePolicy: { ...prev.defaultPurgePolicy, mode },
                    }))
                  }
                />
                {mode === 'timed' && 'Auto-delete after TTL'}
                {mode === 'manual' && 'Keep until manually deleted'}
                {mode === 'never-store' && 'Never save to history'}
              </label>
            ))}
          </div>
          {settings.defaultPurgePolicy.mode === 'timed' && (
            <div className={styles.ttlRow}>
              <label className={styles.labelInline}>Default TTL:</label>
              <select
                className={styles.select}
                value={settings.defaultPurgePolicy.ttlSeconds ?? 3600}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultPurgePolicy: {
                      ...prev.defaultPurgePolicy,
                      ttlSeconds: Number(e.target.value),
                    },
                  }))
                }
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
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Phonetic Profile</h2>

        <div className={styles.field}>
          <label htmlFor="active-profile" className={styles.label}>
            Active profile
          </label>
          <select
            id="active-profile"
            className={styles.select}
            value={settings.activePhoneticProfileId}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, activePhoneticProfileId: e.target.value }))
            }
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} {p.source !== 'built-in' ? `(${p.source})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Custom profiles</label>
          <div className={styles.profileList}>
            {profiles
              .filter((p) => p.source === 'user-custom')
              .map((p) => (
                <div key={p.id} className={styles.profileItem}>
                  <span className={styles.profileName}>{p.label}</span>
                  <div className={styles.profileActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditProfile(p)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteProfile(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            {profiles.filter((p) => p.source === 'user-custom').length === 0 && (
              <p className={styles.hint}>No custom profiles yet.</p>
            )}
          </div>

          <div className={styles.newProfileRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="New profile name..."
              value={newProfileLabel}
              onChange={(e) => setNewProfileLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
            />
            <button
              className={styles.createBtn}
              onClick={handleCreateProfile}
              disabled={!newProfileLabel.trim()}
            >
              Create
            </button>
          </div>
        </div>
      </section>

      {editingProfile && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Edit Profile: {editingProfile.label}</h2>
          <p className={styles.hint}>
            Edit the JSON mappings for letters (A-Z), digits (0-9), and symbols.
          </p>
          <textarea
            className={`${styles.jsonEditor} ${editError ? styles.jsonEditorError : ''}`}
            value={editJson}
            onChange={(e) => {
              setEditJson(e.target.value);
              setEditError('');
            }}
            rows={20}
            spellCheck={false}
          />
          {editError && <p className={styles.errorText}>{editError}</p>}
          <div className={styles.editActions}>
            <button className={styles.cancelBtn} onClick={() => setEditingProfile(null)}>
              Cancel
            </button>
            <button className={styles.saveBtn} onClick={handleSaveProfile}>
              Save Profile
            </button>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Build</h2>
        <p className={styles.hint}>Version {buildVersion}</p>
      </section>

      {saved && <div className={styles.savedToast}>Settings saved</div>}
    </div>
  );
}
