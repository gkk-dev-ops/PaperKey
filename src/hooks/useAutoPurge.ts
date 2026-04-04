import { useEffect, useRef } from 'react';
import { purgeExpiredEntries } from '../lib/storage';

export function useAutoPurge(onPurged?: (count: number) => void) {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    purgeExpiredEntries()
      .then((count) => {
        if (count > 0) {
          console.info(`Auto-purged ${count} expired entries`);
          onPurged?.(count);
        }
      })
      .catch((err) => {
        console.warn('Auto-purge failed:', err);
      });
  }, [onPurged]);
}
