import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { getTransactions } from '../../utils/storage';
import { CATEGORIES } from '../../constants/categories';

function TransactionRow({ item }) {
  const cat = CATEGORIES[item.category] ?? CATEGORIES.Other;
  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: cat.color + '22' }]}>
        <Text style={styles.rowIcon}>{cat.icon}</Text>
      </View>
      <View style={styles.rowMeta}>
        <Text style={styles.rowMerchant} numberOfLines={1}>
          {item.merchant}
        </Text>
        <Text style={styles.rowSub}>
          {cat.label} · {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.rowAmount}>${item.amount.toFixed(2)}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const all = await getTransactions();
    setTransactions(all);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionRow item={item} />}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🧾</Text>
            <Text style={styles.emptyText}>
              No receipts yet. Tap Snap to add one.
            </Text>
          </View>
        }
        contentContainerStyle={
          transactions.length === 0 ? styles.emptyList : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowIcon: { fontSize: 20 },
  rowMeta: { flex: 1, marginLeft: 12 },
  rowMerchant: { fontSize: 15, fontWeight: '500', color: '#111827' },
  rowSub: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  rowAmount: { fontSize: 15, fontWeight: '700', color: '#111827' },
  divider: { height: 1, backgroundColor: '#f3f4f6' },
  emptyList: { flex: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyText: { color: '#9ca3af', fontSize: 15, textAlign: 'center' },
});
