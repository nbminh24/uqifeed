import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { FoodHistoryScreen } from '@/components/food-history';

export default function HomeScreen() {
  const navigateToImageAnalyze = () => {
    router.push('/image-analyze');
  };

  const navigateToTextAnalyze = () => {
    router.push('/text-analyze');
  };

  return (
    <View style={styles.container}>
      <FoodHistoryScreen />
      <View style={styles.floatingButtonsContainer}>
        <FloatingActionButton
          iconName="camera-alt"
          onPress={navigateToImageAnalyze}
          style={styles.floatingButton}
          size={28}
        />
        <FloatingActionButton
          iconName="keyboard"
          onPress={navigateToTextAnalyze}
          style={styles.floatingButton}
          size={28}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    flexDirection: 'column',
    gap: 10,
    zIndex: 1000,
  },
  floatingButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
