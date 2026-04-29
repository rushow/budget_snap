import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="capture"
          options={{ title: 'Snap Receipt', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="confirm"
          options={{ title: 'Confirm Receipt', headerBackTitle: 'Back' }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
