import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { setupNetworkLogging } from '@/utils/networkLogger';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (__DEV__) {
      setupNetworkLogging();
    }
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  } return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: '#163166',
        },
        headerTintColor: '#fff',
      }}>
        {/* Các màn hình sẽ tự định nghĩa tùy chọn header của chúng */}      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
