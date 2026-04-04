import type { CharacterToken } from '../../types';
import styles from './PhoneticTable.module.css';

interface PhoneticTableProps {
  tokens: CharacterToken[];
}

export function PhoneticTable({ tokens }: PhoneticTableProps) {
  if (tokens.length === 0) {
    return <p className={styles.empty}>No characters to display.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table} aria-label="Phonetic pronunciation table">
        <thead>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Char</th>
            <th className={styles.th}>Spoken</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.index} className={`${styles.row} ${styles[`type-${token.type}`]}`}>
              <td className={`${styles.td} ${styles.indexCell}`}>{token.index + 1}</td>
              <td className={`${styles.td} ${styles.charCell}`}>
                {token.type === 'space' ? (
                  <span className={styles.spaceChar} aria-label="space">
                    ·
                  </span>
                ) : (
                  <span className={styles.charDisplay}>{token.raw}</span>
                )}
              </td>
              <td className={`${styles.td} ${styles.spokenCell}`}>
                {token.type === 'unknown' ? (
                  <span className={styles.unknown}>{token.spoken}</span>
                ) : (
                  <span className={styles.spoken}>{token.spoken}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
