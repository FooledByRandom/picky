import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingColors } from '@/constants/theme';

interface OnboardingStepProps {
  title: string;
  description: string;
  icon?: string;
}

/**
 * Reusable component for displaying a single onboarding step
 * Provides consistent layout for title and description
 */
export function OnboardingStep({ title, description }: OnboardingStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: OnboardingColors.text,
    textAlign: 'left',
    marginBottom: 24,
    letterSpacing: -0.5,
    width: '100%',
    maxWidth: 400,
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    color: OnboardingColors.textSecondary,
    textAlign: 'left',
    maxWidth: 400,
    width: '100%',
  },
});

