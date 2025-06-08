import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import { setupNetworkLogging } from '@/utils/networkLogger';

LogBox.ignoreLogs(['Text strings must be rendered within a <Text> component']);

const DEFAULT_TOKEN = 'default-auth-token-123'; // Default token for testing

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (__DEV__) {
      setupNetworkLogging();
    }
    // Set default token on app start
    AsyncStorage.setItem('token', DEFAULT_TOKEN);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#163166',
            },
            headerTintColor: '#fff',
          }}
        />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
