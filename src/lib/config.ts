import { z } from 'zod';
import type { PhoneticProfile } from '../types';

const PhoneticProfileSchema = z.object({
  id: z.string(),
  label: z.string(),
  locale: z.string().optional(),
  source: z.enum(['built-in', 'instance-config', 'user-custom']),
  letters: z.record(z.string()),
  digits: z.record(z.string()),
  symbols: z.record(z.string()),
});

const ConfigSchema = z.object({
  version: z.number(),
  profiles: z.array(PhoneticProfileSchema),
});

export async function loadInstanceProfiles(): Promise<PhoneticProfile[]> {
  try {
    const response = await fetch('/config/phonetic-profiles.json');
    if (!response.ok) {
      console.warn('Could not load instance phonetic profiles config');
      return [];
    }

    const raw = await response.json();
    const parsed = ConfigSchema.safeParse(raw);

    if (!parsed.success) {
      console.warn('Invalid phonetic profiles config:', parsed.error.message);
      return [];
    }

    return parsed.data.profiles.map((p) => ({
      ...p,
      source: 'instance-config' as const,
    }));
  } catch (err) {
    console.warn('Failed to load phonetic profiles config:', err);
    return [];
  }
}
