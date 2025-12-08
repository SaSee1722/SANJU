import { Stack } from 'expo-router';
import { AppProvider } from '@/contexts/AppContext';
import { AlertProvider } from '@/template';

export default function RootLayout() {
  return (
    <AlertProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(student)" />
          <Stack.Screen name="(staff)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </AppProvider>
    </AlertProvider>
  );
}
