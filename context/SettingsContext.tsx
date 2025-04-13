import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, DEFAULT_SETTINGS, settingsService } from '../services/settings';

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  updateSettings: (newSettings: Settings) => Promise<void>;
}

interface SettingsProviderProps {
  children: React.ReactNode;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        const savedSettings = await settingsService.getSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Error initializing settings:', error);
        // Fallback to default settings on error
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeSettings();
  }, []);

  const updateSettings = async (newSettings: Settings): Promise<void> => {
    try {
      setIsLoading(true);
      await settingsService.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render children until settings are initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};