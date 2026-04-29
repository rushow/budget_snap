import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { getTransactions } from '../../utils/storage';
import { CATEGORIES, CATEGORY_NAMES } from '../../constants/categories';

/**
 * Returns the Monday and Sunday bounding the week at `offset` relative to now.
 * offset=0 → current week, offset=-1 → last week, etc.
 */
function getWeekRange(offset) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun … 6=Sat
  const daysFromMonday = (dayOfWeek + 6) % 7; // Mon=0 … Sun=6
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday + offset * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function fmtRange(monday, sunday) {
  const opts = { month: 'short', day: 'numeric' };
  return `${monday.toLocaleDateString(undefined, opts)} – ${sunday.toLocaleDateString(undefined, opts)}`;
}

export default function SummaryScreen() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] = useState([]);

  const compute = useCallback(async () => {
    const { monday, sunday } = getWeekRange(weekOffset);
    const all = await getTransactions();

    const inWeek = all.filter((t) => {
      const d = new Date(t.date);
      return d >= monday && d <= sunday;
    });

    const weekTotal = inWeek.reduce((sum, t) => sum + t.amount, 0);

    const byCat = {};
    inWeek.forEach((t) => {
      byCat[t.category] = (byCat[t.category] ?? 0) + t.amount;
    });

    const rows = CATEGORY_NAMES
      .filter((c) => byCat[c])
      .map((c) => ({
        name: c,
        amount: byCat[c],
        pct: weekTotal > 0 ? (byCat[c] / weekTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    setTotal(weekTotal);
    setBreakdown(rows);
  }, [weekOffset]);

  useFocusEffect(useCallback(() => { compute(); }, [compute]));

  const { monday, sunday } = getWeekRange(weekOffset);
  const isCurrentWeek = weekOffset === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Summary</Text>

        {/* Week navigator */}
        <View style={styles.weekNav}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => setWeekOffset((o) => o - 1)}
          >
            <Text style={styles.navArrow}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.weekLabel}>{fmtRange(monday, sunday)}</Text>

          <TouchableOpacity
            style={[styles.navBtn, isCurrentWeek && styles.navBtnDisabled]}
            onPress={() => !isCurrentWeek && setWeekOffset((o) => o + 1)}
            disabled={isCurrentWeek}
          >
            <Text style={[styles.navArrow, isCurrentWeek && styles.arrowDisabled]}>
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Total card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Spent</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          {isCurrentWeek && (
            <Text style={styles.totalSub}>This week</Text>
          )}
        </View>

        {/* Category breakdown */}
        {breakdown.length === 0 ? (
          <Text style={styles.empty}>No spending this week.</Text>
        ) : (
          breakdown.map((item) => {
            const cat = CATEGORIES[item.name];
            return (
              <View key={item.name} style={styles.catBlock}>
                <View style={styles.catHeader}>
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={styles.catName}>{item.name}</Text>
                  <Text style={styles.catPct}>{Math.round(item.pct)}%</Text>
                  <Text style={styles.catAmount}>${item.amount.toFixed(2)}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${item.pct}%`, backgroundColor: cat.color },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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
    marginBottom: 20,
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navBtn: { padding: 8 },
  navBtnDisabled: { opacity: 0.25 },
  navArrow: { fontSize: 30, color: '#3b82f6', lineHeight: 34 },
  arrowDisabled: { color: '#9ca3af' },
  weekLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
  totalCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 32,
  },
  totalLabel: { fontSize: 13, color: '#6b7280', marginBottom: 4, fontWeight: '500' },
  totalAmount: {
    fontSize: 44,
    fontWeight: '800',
    color: '#1d4ed8',
    letterSpacing: -1,
  },
  totalSub: { fontSize: 12, color: '#93c5fd', marginTop: 4 },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
    fontSize: 15,
  },
  catBlock: { marginBottom: 20 },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  catIcon: { fontSize: 18, marginRight: 8 },
  catName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  catPct: { fontSize: 13, color: '#9ca3af', marginRight: 10 },
  catAmount: { fontSize: 14, fontWeight: '700', color: '#111827' },
  barTrack: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: 4 },
});
