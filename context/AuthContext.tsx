
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../supabaseClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch profile data from the 'profiles' table
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: userId,
        email: email,
        name: data.name || '',
        phone: data.phone || '',
        role: data.role || 'limited',
        interestedProjectIds: data.interested_projects || []
      } as User;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    // Check active session on mount
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email!);
        if (profile) {
          setUser(profile);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email!);
        setUser(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    
    // Update local state optimistically
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);

    // Map frontend camelCase to DB snake_case
    const dbUpdates: any = {};
    if (data.name) dbUpdates.name = data.name;
    if (data.phone) dbUpdates.phone = data.phone;
    if (data.role) dbUpdates.role = data.role;
    if (data.interestedProjectIds) dbUpdates.interested_projects = data.interestedProjectIds;

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      // Revert if necessary, or just log
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    // onAuthStateChange will handle the rest
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // 1. Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setIsLoading(false);
      throw new Error(authError.message);
    }

    if (authData.user) {
      // 2. Create the profile entry
      // Note: We use 'limited' as default role.
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, 
            name, 
            phone, 
            role: 'limited',
            email: email // Storing email in profiles for easier admin viewing
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Clean up auth user if profile creation fails? 
        // For now, we assume success or manual fix.
      }
    }
    
    setIsLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
