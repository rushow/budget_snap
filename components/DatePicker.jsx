import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function Spinner({ value, onUp, onDown }) {
  return (
    <View style={styles.spinner}>
      <TouchableOpacity onPress={onUp} style={styles.arrowBtn} hitSlop={{ top: 8, bottom: 8 }}>
        <Text style={styles.arrow}>▲</Text>
      </TouchableOpacity>
      <Text style={styles.spinnerValue}>{value}</Text>
      <TouchableOpacity onPress={onDown} style={styles.arrowBtn} hitSlop={{ top: 8, bottom: 8 }}>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Zero-dependency date picker modal. Accepts/returns a JS Date.
 * Prevents selecting dates in the future.
 */
export default function DatePicker({ visible, value, onConfirm, onCancel }) {
  const today = new Date();
  const [month, setMonth] = useState(value.getMonth());
  const [day, setDay] = useState(value.getDate());
  const [year, setYear] = useState(value.getFullYear());

  // Sync internal state whenever the modal opens
  useEffect(() => {
    if (visible) {
      setMonth(value.getMonth());
      setDay(value.getDate());
      setYear(value.getFullYear());
    }
  }, [visible]);

  const maxYear = today.getFullYear();
  const minYear = maxYear - 10;
  const maxMonthForYear = year === maxYear ? today.getMonth() : 11;
  const maxDayForMonth = Math.min(
    daysInMonth(month, year),
    year === maxYear && month === today.getMonth() ? today.getDate() : 31
  );

  function nudgeYear(delta) {
    const next = clamp(year + delta, minYear, maxYear);
    setYear(next);
    // Clamp month/day if moving into current year
    if (next === maxYear) {
      const clampedMonth = clamp(month, 0, today.getMonth());
      setMonth(clampedMonth);
      if (clampedMonth === today.getMonth()) {
        setDay(clamp(day, 1, today.getDate()));
      }
    }
  }

  function nudgeMonth(delta) {
    const next = clamp(month + delta, 0, maxMonthForYear);
    setMonth(next);
    // Clamp day when month has fewer days, or we're in today's month
    const maxD = Math.min(
      daysInMonth(next, year),
      year === maxYear && next === today.getMonth() ? today.getDate() : 31
    );
    setDay(clamp(day, 1, maxD));
  }

  function nudgeDay(delta) {
    setDay(clamp(day + delta, 1, maxDayForMonth));
  }

  function handleConfirm() {
    onConfirm(new Date(year, month, day));
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Select Date</Text>

          <View style={styles.row}>
            <Spinner
              value={MONTHS[month].slice(0, 3)}
              onUp={() => nudgeMonth(1)}
              onDown={() => nudgeMonth(-1)}
            />
            <Text style={styles.sep}>/</Text>
            <Spinner
              value={String(day).padStart(2, '0')}
              onUp={() => nudgeDay(1)}
              onDown={() => nudgeDay(-1)}
            />
            <Text style={styles.sep}>/</Text>
            <Spinner
              value={String(year)}
              onUp={() => nudgeYear(1)}
              onDown={() => nudgeYear(-1)}
            />
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 28,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  sep: {
    fontSize: 24,
    color: '#d1d5db',
    marginHorizontal: 6,
    marginBottom: 2,
  },
  spinner: {
    alignItems: 'center',
    minWidth: 72,
  },
  arrowBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  arrow: {
    fontSize: 14,
    color: '#3b82f6',
  },
  spinnerValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 10,
    minWidth: 64,
    textAlign: 'center',
  },
  confirmBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '500',
  },
});
