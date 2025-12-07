
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'investors@inclusivbank.lat';

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

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('soulware_user', JSON.stringify(updatedUser));
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedEmail = email.toLowerCase().trim();
        const isAdminEmail = normalizedEmail === ADMIN_EMAIL;

        // Admin Security Check
        if (isAdminEmail) {
          if (password !== 'HernanJuan2026') {
            setIsLoading(false);
            reject(new Error('Invalid admin credentials.'));
            return;
          }
        } else {
          // Standard user validation
          if (password.length < 6) {
            setIsLoading(false);
            reject(new Error('Password must be at least 6 characters'));
            return;
          }
        }
        
        const role = isAdminEmail ? 'admin' : 'investor';
        
        const mockUser: User = {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          name: isAdminEmail ? 'Admin' : 'User ' + email.split('@')[0],
          email: normalizedEmail,
          phone: '', 
          role: role,
          interestedProjectIds: []
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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const normalizedEmail = email.toLowerCase().trim();
        
        // Prevent registering as admin via standard signup
        if (normalizedEmail === ADMIN_EMAIL) {
          setIsLoading(false);
          reject(new Error('This email is reserved. Please log in.'));
          return;
        }

        const role = 'investor';

        const newUser: User = {
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          name,
          email: normalizedEmail,
          phone,
          role,
          interestedProjectIds: []
        };
        
        setUser(newUser);
        localStorage.setItem('soulware_user', JSON.stringify(newUser));
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
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
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