'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type AuthError,
} from 'firebase/auth';

type AuthErrorHandler = (error: AuthError) => void;
type SuccessHandler = () => void;


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth, onError?: AuthErrorHandler): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance).catch(error => onError?.(error));
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, onError?: AuthErrorHandler): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password).catch(error => onError?.(error));
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, onError?: AuthErrorHandler): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password).catch(error => onError?.(error));
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate password reset email (non-blocking). */
export function initiatePasswordReset(authInstance: Auth, email: string, onSuccess?: SuccessHandler, onError?: AuthErrorHandler): void {
  sendPasswordResetEmail(authInstance, email)
    .then(() => {
      onSuccess?.();
    })
    .catch(error => {
      onError?.(error);
    });
}

/** Initiate sign-out (non-blocking). */
export function initiateSignOut(authInstance: Auth, onError?: AuthErrorHandler): void {
    signOut(authInstance).catch(error => onError?.(error));
}
