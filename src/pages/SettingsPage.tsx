import type { AppSettings, PhoneticProfile, SecretEntry } from '../types';
import { Settings } from '../components/Settings/Settings';

interface HistoryHook {
  entries: SecretEntry[];
  loading: boolean;
  refresh: () => Promise<void>;
  addEntry: (entry: SecretEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  purgeAll: () => Promise<void>;
}

interface SettingsPageProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  profiles: PhoneticProfile[];
  history: HistoryHook;
  refreshProfiles: () => void;
}

export default function SettingsPage({
  profiles,
  refreshProfiles,
}: SettingsPageProps) {
  return <Settings profiles={profiles} onProfilesChange={refreshProfiles} />;
}
