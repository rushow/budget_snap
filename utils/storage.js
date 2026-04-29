import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'budget_snap_transactions';

export async function getTransactions() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveTransaction(transaction) {
  const existing = await getTransactions();
  // Prepend so the list is always newest-first.
  const updated = [transaction, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function deleteTransaction(id) {
  const existing = await getTransactions();
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing.filter((t) => t.id !== id))
  );
}

/** Compact time-based unique ID — no external UUID library needed. */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
