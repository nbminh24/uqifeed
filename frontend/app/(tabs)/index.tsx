import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';

export default function HomeScreen() {
  const navigateToImageAnalyze = () => {
    router.push('/image-analyze');
  };

  const navigateToTextAnalyze = () => {
    router.push('/text-analyze');
  };

  const navigateToFoodDetails = () => {
    router.push('/food-details');
  };

  const navigateToIngredients = () => {
    router.push('/ingredients');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#163166', dark: '#163166' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">UQI Feed</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.buttonsContainer}>
        <ThemedText type="subtitle" style={styles.subtitle}>Choose an option:</ThemedText>

        <Button
          title="Image Analyze"
          onPress={navigateToImageAnalyze}
          style={styles.button}
        />

        <Button
          title="Text Analyze"
          onPress={navigateToTextAnalyze}
          style={styles.button}
        />

        <Button
          title="Food Details"
          type="secondary"
          onPress={navigateToFoodDetails}
          style={styles.button}
        />

        <Button
          title="Ingredients"
          onPress={navigateToIngredients}
          style={styles.button}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonsContainer: {
    gap: 8,
    marginBottom: 24,
    padding: 16,
  },
  subtitle: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
