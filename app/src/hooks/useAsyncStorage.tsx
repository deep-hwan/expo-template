import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  async function getStoredItem(key: string, initialValue: T): Promise<T> {
    try {
      const item = await AsyncStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      return value;
    } catch (error) {
      console.warn(`Error reading AsyncStorage key "${key}":`, error);
      return initialValue;
    }
  }

  useEffect(() => {
    async function loadStoredValue() {
      try {
        const value = await getStoredItem(key, initialValue);
        setStoredValue(value);
      } catch (error) {
        console.warn(`Error in useAsyncStorage for key "${key}":`, error);
        setStoredValue(initialValue);
      } finally {
        setLoading(false);
      }
    }

    loadStoredValue();
  }, [key]);

  const setValue = async (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting AsyncStorage key "${key}":`, error);
    }
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing AsyncStorage key "${key}":`, error);
    }
  };

  return { storedValue, setValue, removeValue, loading };
}

export default useAsyncStorage;
