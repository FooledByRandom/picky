import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

const ONBOARDING_STORAGE_KEY = '@picky:onboarding_completed';

/**
 * Root index route that checks onboarding status and redirects accordingly
 */
export default function Index() {
  const router = useRouter();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (isOnboardingComplete === null) return;

    if (!isOnboardingComplete) {
      router.replace('/onboarding' as any);
    } else {
      router.replace('/(tabs)');
    }
  }, [isOnboardingComplete, router]);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      setIsOnboardingComplete(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingComplete(false);
    }
  };

  return <View />; // Loading/transition state
}

