import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

const ONBOARDING_STORAGE_KEY = '@picky:onboarding_completed';

/**
 * Root index route that checks onboarding and authentication status
 * Redirects to appropriate screen based on user state
 */
export default function Index() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (authLoading || checking) return;

    // If user is not authenticated, show auth screen
    if (!user) {
      router.replace('/auth' as any);
      return;
    }

    // If onboarding not complete, show onboarding
    if (!isOnboardingComplete) {
      router.replace('/onboarding' as any);
      return;
    }

    // User is authenticated and onboarding complete, go to main app
    router.replace('/(tabs)' as any);
  }, [user, authLoading, isOnboardingComplete, checking, router]);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      setIsOnboardingComplete(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingComplete(false);
    } finally {
      setChecking(false);
    }
  };

  if (authLoading || checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

