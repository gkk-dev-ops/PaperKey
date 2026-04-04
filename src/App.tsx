import { useState, useEffect } from 'react';
import { usePhoneticProfiles, usePhoneticProfile } from './hooks/usePhoneticProfile';
import { useHistory } from './hooks/useHistory';
import { useAutoPurge } from './hooks/useAutoPurge';
import { loadSettings } from './lib/settings';
import { getEntry } from './lib/storage';
import type { SecretEntry } from './types';
import Home from './pages/Home';
import EntryDetail from './pages/EntryDetail';
import PrintView from './pages/PrintView';
import SettingsPage from './pages/SettingsPage';
import styles from './App.module.css';

type RouteInfo =
  | { view: 'home' }
  | { view: 'entry'; id: string }
  | { view: 'print'; id: string }
  | { view: 'settings' };

function parseHashRoute(): RouteInfo {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  if (hash.startsWith('entry/')) return { view: 'entry', id: hash.slice(6) };
  if (hash.startsWith('print/')) return { view: 'print', id: hash.slice(6) };
  if (hash === 'settings') return { view: 'settings' };
  return { view: 'home' };
}

export function navigate(path: string) {
  window.location.hash = path;
}

function loadEntryFromSession(id: string): SecretEntry | null {
  try {
    const raw = sessionStorage.getItem(`paperkey-entry-${id}`);
    return raw ? (JSON.parse(raw) as SecretEntry) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [route, setRoute] = useState<RouteInfo>(parseHashRoute);
  const settings = loadSettings();
  const { profiles, refresh: refreshProfiles } = usePhoneticProfiles();
  const activeProfile = usePhoneticProfile(settings.activePhoneticProfileId, profiles);
  const history = useHistory();
  const [entryForView, setEntryForView] = useState<SecretEntry | null>(null);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useAutoPurge(() => void history.refresh());

  useEffect(() => {
    void history.refresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (route.view === 'entry' || route.view === 'print') {
      getEntry(route.id)
        .then((e) => {
          setEntryForView(e ?? loadEntryFromSession(route.id));
        })
        .catch(() => setEntryForView(loadEntryFromSession(route.id)));
    } else {
      setEntryForView(null);
    }
  }, [route]);

  const isPrintView = route.view === 'print';

  return (
    <div className={styles.app}>
      {!isPrintView && (
        <header className={`${styles.header} no-print`}>
          <nav className={styles.nav}>
            <a href="#/" className={styles.logo} aria-label="PaperKey home">
              <span className={styles.logoIcon} aria-hidden="true">🗝</span>
              <span className={styles.logoText}>PaperKey</span>
            </a>
            <div className={styles.navLinks}>
              <a
                href="#/"
                className={route.view === 'home' ? styles.navLinkActive : styles.navLink}
              >
                New
              </a>
              <a
                href="#/settings"
                className={route.view === 'settings' ? styles.navLinkActive : styles.navLink}
              >
                Settings
              </a>
            </div>
          </nav>
        </header>
      )}

      <main className={isPrintView ? styles.mainPrint : styles.main}>
        {route.view === 'home' && (
          <Home settings={settings} history={history} activeProfile={activeProfile} />
        )}
        {route.view === 'entry' && entryForView && (
          <EntryDetail entry={entryForView} history={history} activeProfile={activeProfile} />
        )}
        {route.view === 'entry' && !entryForView && (
          <div style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>
            Loading entry…
          </div>
        )}
        {route.view === 'print' && entryForView && (
          <PrintView entry={entryForView} activeProfile={activeProfile} />
        )}
        {route.view === 'settings' && (
          <SettingsPage
            settings={settings}
            onSettingsChange={() => void 0}
            profiles={profiles}
            history={history}
            refreshProfiles={refreshProfiles}
          />
        )}
      </main>

      {!isPrintView && (
        <footer className={`${styles.footer} no-print`}>
          <p>
            Built by Grzegorz Kaczmarek — need custom software development?{' '}
            <a href="https://gkk-dev.com" target="_blank" rel="noopener noreferrer">
              Visit gkk-dev.com
            </a>
          </p>
          <p className={styles.footerPrivacy}>
            All data stays in this browser only. No data is sent to any server.
          </p>
        </footer>
      )}
    </div>
  );
}
