import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, router } from 'expo-router';
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
        <Text style={styles.rowDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.rowAmount}>${item.amount.toFixed(2)}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [recent, setRecent] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getTransactions().then((all) => setRecent(all.slice(0, 5)));
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.appName}>Budget Snap</Text>

      <TouchableOpacity
        style={styles.snapBtn}
        activeOpacity={0.85}
        onPress={() => router.push('/capture')}
      >
        <Text style={styles.snapIcon}>📷</Text>
        <Text style={styles.snapText}>Snap Receipt</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Recent</Text>

      {recent.length === 0 ? (
        <Text style={styles.empty}>
          No receipts yet. Tap Snap to add one.
        </Text>
      ) : (
        <FlatList
          data={recent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionRow item={item} />}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          scrollEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
    marginBottom: 24,
  },
  snapBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 18,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 36,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  snapIcon: { fontSize: 22 },
  snapText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  empty: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 48,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
  rowDate: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  rowAmount: { fontSize: 15, fontWeight: '700', color: '#111827' },
  divider: { height: 1, backgroundColor: '#f3f4f6' },
});
