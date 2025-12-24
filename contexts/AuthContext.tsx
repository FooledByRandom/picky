/**
 * Authentication context provider
 * Manages global authentication state and provides auth methods to the app
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getCurrentUser, getCurrentSession, onAuthStateChange, signIn, signUp, signOut, type SignInCredentials, type SignUpCredentials } from '@/lib/services/auth-service';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<{ error: { message: string } | null }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ error: { message: string } | null }>;
  signOut: () => Promise<{ error: { message: string } | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication provider component
 * Wraps the app and manages authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const { user: currentUser, session: currentSession } = await getCurrentUser();
      setUser(currentUser);
      setSession(currentSession);
    } catch (error) {
      console.error('Error refreshing session:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial session load
    refreshSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession]);

  const handleSignIn = useCallback(async (credentials: SignInCredentials) => {
    setLoading(true);
    try {
      const { session: newSession, error } = await signIn(credentials);
      if (error) {
        return { error: { message: error.message } };
      }
      setSession(newSession);
      setUser(newSession?.user ?? null);
      return { error: null };
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : 'An unexpected error occurred' },
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignUp = useCallback(async (credentials: SignUpCredentials) => {
    setLoading(true);
    try {
      const { user: newUser, error } = await signUp(credentials);
      
      // If user was created but email confirmation failed, still allow sign up
      // This handles the case where email service isn't configured
      if (newUser && error && error.message.toLowerCase().includes('email')) {
        console.warn('User created but email confirmation failed:', error.message);
        // Get session if available
        const currentSession = await getCurrentSession();
        setSession(currentSession);
        setUser(newUser);
        return { error: null };
      }
      
      if (error) {
        return { error: { message: error.message } };
      }
      
      // After sign up, get the session
      const currentSession = await getCurrentSession();
      setSession(currentSession);
      setUser(newUser);
      return { error: null };
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : 'An unexpected error occurred' },
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        return { error: { message: error.message } };
      }
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      return {
        error: { message: error instanceof Error ? error.message : 'An unexpected error occurred' },
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

