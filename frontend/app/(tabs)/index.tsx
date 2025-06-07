import { StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { FoodHistoryScreen } from '../../components/food-history';

const { width: screenWidth } = Dimensions.get('window');
const MASCOT_SIZE = screenWidth;

export default function HomeScreen() {
  const navigateToImageAnalyze = () => {
    router.push('/image-analyze');
  };
  const navigateToTextAnalyze = () => {
    router.push('/text-analyze');
  };

  const navigateToChatbot = () => {
    router.push('/chatbot');
  };

  return (
    <View style={styles.container}>
      {/* Mascot GIF with frame */}
      <View style={styles.mascotContainer}>
        <TouchableOpacity
          onPress={navigateToChatbot}
          style={styles.mascotTouchable}
          activeOpacity={0.8}
        >
          <View style={styles.mascotFrame}>
            <View style={styles.mascotWrapper}>
              <Image
                source={{ uri: 'https://cdn.dribbble.com/userupload/33219605/file/original-3e652baea723121800ca0068452af00e.gif' }}
                style={styles.mascot}
                resizeMode="contain" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.contentContainer}>
        <FoodHistoryScreen />
      </View>

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
    backgroundColor: '#fff',
  },
  mascotContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  mascotTouchable: {
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mascotFrame: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  mascotWrapper: {
    overflow: 'hidden',
    height: MASCOT_SIZE - 90, // Cắt bớt ~2cm (40px)
  },
  mascot: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
  },
  contentContainer: {
    flex: 1,
    paddingTop: MASCOT_SIZE - 90, // Bù thêm vì mascot bị cắt
  }, floatingButtonsContainer: {
    position: 'absolute',
    top: 90, // Điều chỉnh khoảng cách từ trên xuống
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
