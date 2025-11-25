// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = { anchor: 'homescreen' };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* SỬA: Dùng (tabs) thay vì homescreen */}
      <Stack.Screen name="index" />
      <Stack.Screen name="homescreen" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />

       <Stack.Screen 
        name="../(tabs)/order-ticket" 
        options={{ 
          headerShown: false, // Ẩn header mặc định để dùng header tự thiết kế
          presentation: 'card' // Hiệu ứng trượt ngang
        }} 
      />

    </Stack>
  );
}