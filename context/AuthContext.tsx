
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'inclusivbank@gmail.com';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('soulware_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user session');
        localStorage.removeItem('soulware_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (password.length < 6) {
          setIsLoading(false);
          reject(new Error('Password must be at least 6 characters'));
          return;
        }
        
        // Check for specific admin email
        const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'investor';
        
        const mockUser: User = {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          name: 'User ' + email.split('@')[0],
          email,
          phone: '', 
          role: role
        };
        
        setUser(mockUser);
        localStorage.setItem('soulware_user', JSON.stringify(mockUser));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'investor';

        const newUser: User = {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          name,
          email,
          phone,
          role
        };
        
        setUser(newUser);
        localStorage.setItem('soulware_user', JSON.stringify(newUser));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const socialLogin = async (provider: 'google' | 'linkedin', manualEmail?: string): Promise<void> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // For simulation purposes, if the user manually typed the admin email 
        // into a "fake" google login prompt, we'd use that. 
        // Since we don't have a real Google pop-up, we'll default to a generic user
        // UNLESS this is specifically for the admin demo instructions.
        
        // In a real app, Google returns the email. Here we simulate it.
        // If you are testing, use the login form with the specific email.
        // Or for this demo, we can randomly assign the admin email if prompted via a specific flow,
        // but typically social login just works.
        
        // Let's assume standard social login is NOT admin unless we mock it.
        // However, the prompt specifically asked for google sign in FOR the admin panel.
        // We will fallback to a standard user unless the developer hardcodes the simulation 
        // or uses the manual login form with that email.
        
        // MOCK: If this function is called, we'll simulate a standard user
        // UNLESS the 'manualEmail' arg is passed (used for testing).
        
        const email = manualEmail || (provider === 'google' ? 'user@gmail.com' : 'user@linkedin.com');
        const role = email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'investor';

        const mockUser: User = {
          id: 'usr_' + provider + '_' + Math.random().toString(36).substr(2, 9),
          name: provider === 'google' ? 'Google User' : 'LinkedIn User',
          email: email,
          phone: '',
          role: role
        };
        
        setUser(mockUser);
        localStorage.setItem('soulware_user', JSON.stringify(mockUser));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('soulware_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, socialLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
