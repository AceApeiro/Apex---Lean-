import React, { createContext, useContext, useState } from 'react';

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
  // ✅ FAKE USER (always logged in)
  const [user, setUser] = useState<User | null>({
    id: 'guest-id',
    email: 'guest@local.app',
    role: 'admin', // 👈 gives full access
    name: 'Guest User',
    photoURL: ''
  });

  const [loading] = useState(false);

  // ✅ Mock login (does nothing)
  const login = async () => {
    console.log('Mock login');
  };

  const loginWithEmail = async (email: string, pass: string) => {
    console.log('Mock email login', email);
  };

  const signupWithEmail = async (email: string, pass: string) => {
    console.log('Mock signup', email);
  };

  const logout = async () => {
    console.log('Mock logout');
    setUser({
      id: 'guest-id',
      email: 'guest@local.app',
      role: 'admin',
      name: 'Guest User',
      photoURL: ''
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithEmail,
        signupWithEmail,
        logout,
        isAdmin,
        loading
      }}
    >
      {children}
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
