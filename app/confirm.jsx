import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import DatePicker from '../components/DatePicker';
import { CATEGORIES, CATEGORY_NAMES } from '../constants/categories';
import { saveTransaction, generateId } from '../utils/storage';

export default function ConfirmScreen() {
  const { imageUri } = useLocalSearchParams();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('Food');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  async function handleSave() {
    const parsed = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!merchant.trim()) {
      Alert.alert('Missing Info', 'Please enter a merchant name.');
      return;
    }
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert('Missing Info', 'Please enter a valid amount greater than 0.');
      return;
    }

    await saveTransaction({
      id: generateId(),
      merchant: merchant.trim(),
      amount: parsed,
      date: date.toISOString(),
      category,
      imageUri: imageUri || null,
    });

    // Replace so tapping back from Home doesn't return here
    router.replace('/');
  }

  const cat = CATEGORIES[category];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          {/* Receipt thumbnail */}
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.thumb} />
          ) : (
            <View style={styles.noPhoto}>
              <Text style={styles.noPhotoIcon}>🧾</Text>
              <Text style={styles.noPhotoText}>No photo attached</Text>
            </View>
          )}

          {/* Merchant */}
          <Text style={styles.label}>Merchant</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Starbucks"
            placeholderTextColor="#9ca3af"
            value={merchant}
            onChangeText={setMerchant}
            returnKeyType="next"
            autoCapitalize="words"
          />

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>

          {/* Date */}
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.inputTouchable}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputTouchableText}>
              {date.toLocaleDateString()}
            </Text>
            <Text style={styles.inputChevron}>›</Text>
          </TouchableOpacity>

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={[styles.inputTouchable, styles.catRow]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <Text style={[styles.inputTouchableText, { flex: 1 }]}>{category}</Text>
            <Text style={styles.inputChevron}>›</Text>
          </TouchableOpacity>

          {/* Actions */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Save Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.discardBtn} onPress={() => router.back()}>
            <Text style={styles.discardBtnText}>Discard</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom date picker (no native dependency) */}
      <DatePicker
        visible={showDatePicker}
        value={date}
        onConfirm={(picked) => { setDate(picked); setShowDatePicker(false); }}
        onCancel={() => setShowDatePicker(false)}
      />

      {/* Category picker modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.catSheet}>
            <Text style={styles.catSheetTitle}>Select Category</Text>
            <FlatList
              data={CATEGORY_NAMES}
              keyExtractor={(k) => k}
              renderItem={({ item }) => {
                const c = CATEGORIES[item];
                const selected = item === category;
                return (
                  <TouchableOpacity
                    style={[styles.catItem, selected && styles.catItemSelected]}
                    onPress={() => { setCategory(item); setShowCategoryModal(false); }}
                  >
                    <View style={[styles.catItemDot, { backgroundColor: c.color + '22' }]}>
                      <Text style={styles.catItemIcon}>{c.icon}</Text>
                    </View>
                    <Text style={styles.catItemLabel}>{item}</Text>
                    {selected && <Text style={styles.catItemCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              style={styles.catSheetCancel}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.catSheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },

  thumb: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 14,
    marginBottom: 24,
    marginTop: 8,
  },
  noPhoto: {
    height: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    marginTop: 8,
  },
  noPhotoIcon: { fontSize: 24 },
  noPhotoText: { color: '#9ca3af', fontSize: 14 },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
    marginBottom: 18,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    marginBottom: 0,
  },
  inputTouchable: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTouchableText: { fontSize: 15, color: '#111827' },
  inputChevron: { fontSize: 20, color: '#9ca3af', marginLeft: 'auto' },
  catRow: {},
  catIcon: { fontSize: 20, marginRight: 10 },

  saveBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  discardBtn: { alignItems: 'center', paddingVertical: 12 },
  discardBtnText: { color: '#ef4444', fontSize: 15, fontWeight: '500' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  catSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    maxHeight: '75%',
  },
  catSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  catItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  catItemSelected: { backgroundColor: '#eff6ff' },
  catItemDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  catItemIcon: { fontSize: 20 },
  catItemLabel: { fontSize: 16, color: '#111827', flex: 1 },
  catItemCheck: { color: '#3b82f6', fontSize: 18, fontWeight: '700' },
  catSheetCancel: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  catSheetCancelText: { color: '#ef4444', fontSize: 16, fontWeight: '500' },
});
