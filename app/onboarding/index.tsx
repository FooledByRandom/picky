import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingStep } from '@/components/OnboardingStep';
import { OnboardingDots } from '@/components/OnboardingDots';
import { OnboardingColors } from '@/constants/theme';

const ONBOARDING_STORAGE_KEY = '@picky:onboarding_completed';

/**
 * Three-step onboarding flow introducing app features:
 * 1. Barcode scanning for reviews
 * 2. Product search capabilities
 * 3. Review writing functionality
 */
export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Scan barcodes to see reviews',
      description: 'Scan product barcodes to instantly see reviews from across the internet. Get comprehensive insights before you buy.',
    },
    {
      title: 'Search for products',
      description: 'Search for products by name, brand, UPC, or description. Find exactly what you\'re looking for quickly and easily.',
    },
    {
      title: 'Write your own reviews',
      description: 'Share your experiences by writing reviews. Help others make informed decisions about the products they\'re considering.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(tabs)');
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <OnboardingStep 
          title={currentStepData.title} 
          description={currentStepData.description} 
        />
      </View>

      <View style={styles.footer}>
        <OnboardingDots totalSteps={steps.length} currentStep={currentStep} />
        
        <View style={styles.buttonContainer}>
          {currentStep < steps.length - 1 ? (
            <>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: OnboardingColors.background,
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 17,
    fontWeight: '400',
    color: OnboardingColors.link,
    textAlign: 'center',
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: OnboardingColors.primaryButton,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: OnboardingColors.primaryButtonText,
    textAlign: 'center',
  },
  getStartedButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: OnboardingColors.primaryButton,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: OnboardingColors.primaryButtonText,
    textAlign: 'center',
  },
});

