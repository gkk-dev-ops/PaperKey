export interface SecretEntry {
  id: string;
  title?: string;
  category?: 'password' | 'recovery-code' | 'seed-fragment' | 'api-key' | 'wifi' | 'other';
  secretPlaintext?: string;
  secretCiphertext?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
  expiresAt?: string | null;
  purgePolicy?: {
    mode: 'never-store' | 'manual' | 'timed';
    ttlSeconds?: number;
  };
  formatting?: {
    groupSize?: number;
    lineBreakEvery?: number;
    largePrint?: boolean;
  };
  phoneticProfileId?: string;
  encryption?: {
    enabled: boolean;
    salt?: string;
    iv?: string;
    version?: number;
  };
}

export interface PhoneticProfile {
  id: string;
  label: string;
  locale?: string;
  source: 'built-in' | 'instance-config' | 'user-custom';
  letters: Record<string, string>;
  digits: Record<string, string>;
  symbols: Record<string, string>;
}

export interface CharacterToken {
  index: number;
  raw: string;
  type: 'upper' | 'lower' | 'digit' | 'space' | 'symbol' | 'unknown';
  phonetic?: string;
  spoken: string;
  caseLabel?: 'capital' | 'lowercase';
}

export interface AppSettings {
  historyEnabled: boolean;
  defaultPurgePolicy: {
    mode: 'never-store' | 'manual' | 'timed';
    ttlSeconds?: number;
  };
  activePhoneticProfileId: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  historyEnabled: true,
  defaultPurgePolicy: {
    mode: 'timed',
    ttlSeconds: 3600,
  },
  activePhoneticProfileId: 'nato',
};
