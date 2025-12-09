# Picky

A product discovery and review app built with React Native and Expo. Scan barcodes, search for products, and write reviews to help others make informed purchasing decisions.

## Features

- **Barcode Scanning**: Scan product barcodes to instantly see reviews from across the internet
- **Product Search**: Search for products by name, brand, UPC, or description
- **Review Writing**: Share your experiences by writing reviews

## Get started

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- iOS Simulator (for Mac) or Android Emulator, or Expo Go app on your phone

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure

- `app/` - Main application code with file-based routing
  - `onboarding/` - Three-step onboarding flow
  - `(tabs)/` - Main app tabs
- `components/` - Reusable React components
  - `OnboardingStep.tsx` - Individual onboarding step component
  - `OnboardingDots.tsx` - Navigation indicator dots
- `constants/` - App constants and theme configuration

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
