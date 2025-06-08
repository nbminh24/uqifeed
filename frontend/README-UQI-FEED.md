# UQI Feed App - Frontend

This is the frontend of the UQI Feed application that allows users to analyze foods using images or text descriptions.

## Features

- **Image Analysis**: Upload food images to get detailed nutritional information
- **Text Analysis**: Describe your food in text to get nutritional analysis
- **Food Details**: View detailed information about previously analyzed foods

## Project Structure

- `app/(tabs)`: Contains tab-based navigation screens
- `app/image-analyze.tsx`: Screen for analyzing food via images
- `app/text-analyze.tsx`: Screen for analyzing food via text descriptions
- `app/food-details.tsx`: Screen for viewing detailed food information
- `components/ui/Button.tsx`: Custom button component for navigation

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Follow the instructions to run on your desired platform (iOS, Android, or web)

## Next Steps

- Implement image upload and analysis functionality
- Add text input and analysis
- Create detailed view for food analysis results
- Connect to backend APIs
