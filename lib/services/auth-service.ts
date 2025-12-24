/**
 * Authentication service for Supabase
 * Handles user sign up, sign in, sign out, and session management
 */
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface SignUpCredentials {
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

/**
 * Register a new user account
 * Note: If email confirmation is enabled but email service isn't configured,
 * the user will still be created but you may see an email error.
 * For development, consider disabling email confirmation in Supabase settings.
 */
export async function signUp(credentials: SignUpCredentials): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        // Skip email confirmation for development
        // Remove this if you want email confirmation enabled
        emailRedirectTo: undefined,
      },
    });

    // If user was created but email failed, still allow sign up
    // The user account exists even if email confirmation fails
    if (data?.user && !error) {
      return { user: data.user, error: null };
    }

    // Check if error is specifically about email confirmation
    if (error) {
      // If user was created but email failed, treat as success for development
      if (data?.user && error.message.toLowerCase().includes('email')) {
        console.warn('User created but email confirmation failed:', error.message);
        return { user: data.user, error: null };
      }
      return { user: null, error: { message: error.message, status: error.status } };
    }

    return { user: data?.user ?? null, error: null };
  } catch (error) {
    return {
      user: null,
      error: { message: error instanceof Error ? error.message : 'An unexpected error occurred' },
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(credentials: SignInCredentials): Promise<{ session: Session | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { session: null, error: { message: error.message, status: error.status } };
    }

    return { session: data.session, error: null };
  } catch (error) {
    return {
      session: null,
      error: { message: error instanceof Error ? error.message : 'An unexpected error occurred' },
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: { message: error.message, status: error.status } };
    }

    return { error: null };
  } catch (error) {
    return {
      error: { message: error instanceof Error ? error.message : 'An unexpected error occurred' },
    };
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<{ user: User | null; session: Session | null }> {
  try {
    const { data: { user, session }, error } = await supabase.auth.getUser();

    if (error) {
      return { user: null, session: null };
    }

    return { user, session };
  } catch (error) {
    return { user: null, session: null };
  }
}

/**
 * Get the current session
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Subscribe to authentication state changes
 */
export function onAuthStateChange(
  callback: (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED', session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
      callback(event, session);
    }
  });
}

