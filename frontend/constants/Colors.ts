/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#64FFDA'; // Bright mint color
const tintColorDark = '#64FFDA'; // Same bright mint for dark mode

export const Colors = {
  light: {
    text: '#1E2A3A', // Dark blue-black for text
    background: '#FFFFFF', // Pure white background
    tint: '#1E2A3A', // Dark blue-black for primary elements
    icon: '#1E2A3A', // Dark blue-black for icons
    tabIconDefault: '#90A4AE', // Blue-grey for inactive tabs
    tabIconSelected: '#1E2A3A', // Dark blue-black for selected tab
  },
  dark: {
    text: '#E0F2F1', // Light cyan-tinted white for text
    background: '#162436', // Deep blue-black background
    tint: '#64FFDA', // Bright mint for primary elements
    icon: '#64FFDA', // Bright mint for icons
    tabIconDefault: '#546E7A', // Darker blue-grey for inactive tabs
    tabIconSelected: '#64FFDA', // Bright mint for selected tab
  },
};
