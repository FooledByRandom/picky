import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingColors } from '@/constants/theme';

interface OnboardingDotsProps {
  totalSteps: number;
  currentStep: number;
}

/**
 * Navigation indicator component showing current step position
 * Displays dots for each step with active state highlighting
 */
export function OnboardingDots({ totalSteps, currentStep }: OnboardingDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: OnboardingColors.dotActive,
    width: 20,
  },
  dotInactive: {
    backgroundColor: OnboardingColors.dotInactive,
  },
});

