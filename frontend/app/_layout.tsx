import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>      <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />        <Stack.Screen
        name="image-analyze"
        options={{
          headerTitle: 'Image Analyze',
          headerStyle: {
            backgroundColor: '#163166',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="text-analyze"
        options={{
          headerTitle: 'Text Analyze',
          headerStyle: {
            backgroundColor: '#163166',
          },
          headerTintColor: '#fff',
        }}
      />      <Stack.Screen
        name="food-details"
        options={{
          headerTitle: 'Food Details',
          headerStyle: {
            backgroundColor: '#163166',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="ingredients"
        options={{
          headerTitle: 'Ingredients',
          headerStyle: {
            backgroundColor: '#163166',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
