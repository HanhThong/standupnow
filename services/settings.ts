import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SETTINGS_STORAGE_KEY = '@stand_up_now_settings';

export interface Settings {
  timerDuration: number; // in minutes
}

export const DEFAULT_SETTINGS: Settings = {
  timerDuration: 45, // default 45 minutes
};

class StorageService {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  }
}

const storage = new StorageService();

export const settingsService = {
  async getSettings(): Promise<Settings> {
    try {
      const settingsJson = await storage.getItem(SETTINGS_STORAGE_KEY);
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Settings): Promise<void> {
    try {
      await storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  },
};