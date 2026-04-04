import type { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

const SETTINGS_KEY = 'paperkey-settings';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      defaultPurgePolicy: {
        ...DEFAULT_SETTINGS.defaultPurgePolicy,
        ...(parsed.defaultPurgePolicy ?? {}),
      },
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
