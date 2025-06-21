import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const webStorage = typeof window !== 'undefined' ? window.localStorage : null;

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      return webStorage?.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      return webStorage?.setItem(key, value);
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      return webStorage?.removeItem(key);
    }
    return SecureStore.deleteItemAsync(key);
  }
};

//const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
//const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseUrl = '';
const supabaseAnonKey = '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
