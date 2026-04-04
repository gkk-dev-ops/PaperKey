import { useState } from 'react';
import type { PhoneticProfile, SecretEntry } from '../types';
import { PrintSheet } from '../components/PrintSheet/PrintSheet';
import { navigate } from '../App';
import styles from './PrintView.module.css';

interface PrintViewProps {
  entry: SecretEntry;
  activeProfile: PhoneticProfile;
}

export default function PrintView({ entry, activeProfile }: PrintViewProps) {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div className={styles.container}>
      {showWarning && (
        <div className={styles.printWarningBanner} role="alert">
          <div className={styles.warningContent}>
            <strong>Print Safety Reminder</strong>
            <p>
              Ensure you are in a private location. Check that no one can see your screen. This
              document will contain your secret in plaintext. Store the printed copy securely and
              destroy it when no longer needed.
            </p>
          </div>
          <div className={styles.warningActions}>
            <button className={styles.dismissBtn} onClick={() => setShowWarning(false)}>
              I understand, continue
            </button>
          </div>
        </div>
      )}

      <div className={`${styles.toolbar} no-print`}>
        <button className={styles.backBtn} onClick={() => navigate(`entry/${entry.id}`)}>
          ← Back
        </button>
        <button className={styles.printTriggerBtn} onClick={() => window.print()}>
          🖨 Print Now
        </button>
      </div>

      <PrintSheet entry={entry} profile={activeProfile} />
    </div>
  );
}
