import { useState, useEffect } from 'react';
import type { PhoneticProfile } from '../types';
import { NATO_PROFILE } from '../lib/phonetic';
import { loadInstanceProfiles } from '../lib/config';
import { getAllProfiles } from '../lib/storage';

export function usePhoneticProfiles() {
  const [profiles, setProfiles] = useState<PhoneticProfile[]>([NATO_PROFILE]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [instanceProfiles, userProfiles] = await Promise.all([
        loadInstanceProfiles(),
        getAllProfiles(),
      ]);

      setProfiles([
        NATO_PROFILE,
        ...instanceProfiles,
        ...userProfiles.filter((p) => p.source === 'user-custom'),
      ]);
    } catch (err) {
      console.warn('Failed to load phonetic profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { profiles, loading, refresh };
}

export function usePhoneticProfile(id: string, profiles: PhoneticProfile[]): PhoneticProfile {
  return profiles.find((p) => p.id === id) ?? NATO_PROFILE;
}
