# Picky

A product discovery and review app built with React Native and Expo. Scan barcodes, search for products, and write reviews to help others make informed purchasing decisions.

## Features

- **Barcode Scanning**: Scan product barcodes to instantly see reviews from across the internet
- **Product Search**: Search for products by name, brand, UPC, or description
- **AI Product Analysis**: Paste a product URL to get AI-generated review summaries with source citations using Gemini with Google Search grounding
- **Review Writing**: Share your experiences by writing reviews

## Get started

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- iOS Simulator (for Mac) or Android Emulator, or Expo Go app on your phone
- Supabase account and project
- Google Gemini API key (for product analysis feature)

### Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables

   Copy `.env.example` to `.env` and fill in your Supabase credentials:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual values:
   - `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

3. Set up the database

   Run the database migrations in your Supabase SQL editor:
   - `lib/supabase/migrations/initial-schema.sql` - Initial schema
   - `lib/supabase/migrations/add-products-table.sql` - Products table for AI analysis

4. Set up Supabase Edge Functions

   Install the Supabase CLI if you haven't already:

   ```bash
   npm install -g supabase
   ```

   Link your Supabase project:

   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

   Set the required secrets for Edge Functions:

   ```bash
   supabase secrets set GOOGLE_API_KEY=your_gemini_api_key
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

   Get your credentials:
   - **Project Ref**: Found in your Supabase project URL (`https://YOUR_PROJECT_REF.supabase.co`)
   - **Service Role Key**: Found in [Supabase Dashboard](https://app.supabase.com/project/_/settings/api) under "service_role" key
   - **Google API Key**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)

   Test the Edge Function locally:

   ```bash
   supabase functions serve analyze-product
   ```

   Deploy the Edge Function:

   ```bash
   supabase functions deploy analyze-product
   ```

5. Start the app

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
  - `ProductAnalysisModal.tsx` - Modal for displaying AI-analyzed product results
- `constants/` - App constants and theme configuration
- `lib/` - Core library code
  - `services/` - Service layer for API calls and data management
    - `product-analysis-service.ts` - Service for analyzing product URLs
  - `supabase/` - Supabase configuration and migrations
    - `migrations/` - Database migration files
    - `functions/` - Supabase Edge Functions
      - `analyze-product/` - Edge Function for AI product analysis
- `supabase/functions/` - Supabase Edge Functions (Deno)
  - `analyze-product/` - Product analysis function using Gemini with Google Search grounding

## Product Analysis Feature

The app includes an AI-powered product analysis feature that uses Google's Gemini API with Google Search grounding. When you paste a product URL in the search bar, the app will:

1. Scrape product metadata (title, image)
2. Use Gemini to research reviews across Reddit, YouTube, and independent review sites
3. Generate a 2-sentence summary of general sentiment (pros/cons)
4. Provide clickable citations to the sources used

The analysis is cached for 7 days to reduce API calls and improve performance.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions): Learn about Supabase Edge Functions for serverless backend logic.
- [Google Gemini API](https://ai.google.dev/docs): Documentation for Google's Gemini AI models.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
