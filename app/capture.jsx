import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function CaptureScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  async function launchCamera() {
    setLoading(true);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera access is needed to snap receipts. Please enable it in Settings.'
      );
      setLoading(false);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });
    setLoading(false);
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  function proceed() {
    router.push({
      pathname: '/confirm',
      params: { imageUri: imageUri ?? '' },
    });
  }

  function enterManually() {
    router.push({ pathname: '/confirm', params: { imageUri: '' } });
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>No photo taken yet</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.cameraBtn}
        onPress={launchCamera}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.cameraBtnText}>
            {imageUri ? '🔄  Retake Photo' : '📷  Open Camera'}
          </Text>
        )}
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity
          style={styles.proceedBtn}
          onPress={proceed}
          activeOpacity={0.85}
        >
          <Text style={styles.proceedBtnText}>Use This Photo →</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.skipBtn} onPress={enterManually}>
        <Text style={styles.skipBtnText}>Skip Photo · Enter Manually</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  preview: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    resizeMode: 'cover',
    marginBottom: 24,
  },
  placeholder: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    marginBottom: 24,
  },
  placeholderIcon: { fontSize: 52 },
  placeholderText: { color: '#9ca3af', marginTop: 12, fontSize: 15 },
  cameraBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 12,
  },
  cameraBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  proceedBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 12,
  },
  proceedBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  skipBtn: { alignItems: 'center', paddingVertical: 14 },
  skipBtnText: { color: '#6b7280', fontSize: 14 },
});
