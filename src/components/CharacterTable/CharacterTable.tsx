import type { CharacterToken } from '../../types';
import styles from './CharacterTable.module.css';

interface CharacterTableProps {
  tokens: CharacterToken[];
}

const TYPE_LABELS: Record<CharacterToken['type'], string> = {
  upper: 'Uppercase',
  lower: 'Lowercase',
  digit: 'Digit',
  space: 'Space',
  symbol: 'Symbol',
  unknown: 'Unknown',
};

export function CharacterTable({ tokens }: CharacterTableProps) {
  if (tokens.length === 0) {
    return <p className={styles.empty}>No characters to display.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table} aria-label="Character breakdown table">
        <thead>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Char</th>
            <th className={styles.th}>Type</th>
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
              <td className={`${styles.td} ${styles.typeCell}`}>
                <span className={`${styles.typeBadge} ${styles[`badge-${token.type}`]}`}>
                  {TYPE_LABELS[token.type]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
