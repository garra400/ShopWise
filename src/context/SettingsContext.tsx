import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Settings } from '@/types';
import { loadSettings, saveSettings } from '@/services/storage';

const DEFAULT_SETTINGS: Settings = {
  themePreference: 'system',
  notificationsEnabled: true,
  language: 'pt',
  measurementSystem: 'metric',
  defaultUnit: 'un',
  dietTags: [],
  allergens: [],
  cuisines: [],
  avoidIngredients: [],
};

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: async () => {},
  loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const updateSettings = useCallback(async (patch: Partial<Settings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    await saveSettings(updated);
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
