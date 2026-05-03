import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithPopup, googleProvider, signOut, onAuthStateChanged, db, doc, getDoc, setDoc, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signupWithEmail: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Check if user exists in Firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          let role = 'user';
          if (userSnap.exists()) {
            role = userSnap.data().role || 'user';
            // Force info@acestool.com to be admin if somehow it's not
            if (firebaseUser.email === 'info@acestool.com' && role !== 'admin') {
              role = 'admin';
              await setDoc(userRef, { role: 'admin' }, { merge: true });
            }
          } else {
            // Create new user document
            // Make info@acestool.com admin by default
            role = firebaseUser.email === 'info@acestool.com' ? 'admin' : 'user';
            await setDoc(userRef, {
              email: firebaseUser.email,
              role: role,
              createdAt: new Date().toISOString()
            });
          }

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: role,
            name: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || ''
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, loginWithEmail, signupWithEmail, logout, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
