import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        tint={colorScheme}
        intensity={95}
        style={StyleSheet.absoluteFill}
      />
    );
  }

  return null;
}

// Helper to manage bottom tab overflow padding
export function useBottomTabOverflow() {
  return Platform.OS === 'ios' ? 20 : 0;
}
