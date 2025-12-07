
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProjectData, DataContextType, InvestorLead, User } from '../types';
import { projects as initialProjects } from '../data';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    const saved = localStorage.getItem('soulware_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [leads, setLeads] = useState<InvestorLead[]>(() => {
    const saved = localStorage.getItem('soulware_leads');
    return saved ? JSON.parse(saved) : [];
  });

  // Simulated User Database for Admin Panel
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('soulware_users_db');
    if (saved) return JSON.parse(saved);
    
    // Default mock users if none exist
    return [
      {
        id: 'admin_1',
        name: 'Admin',
        email: 'investors@inclusivbank.lat',
        phone: '+15550001111',
        role: 'admin',
        interestedProjectIds: []
      },
      {
        id: 'inv_1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+15550002222',
        role: 'investor',
        interestedProjectIds: ['soulware-ecosystem']
      },
      {
        id: 'lim_1',
        name: 'New Visitor',
        email: 'visitor@example.com',
        phone: '+15550003333',
        role: 'limited',
        interestedProjectIds: []
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('soulware_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('soulware_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('soulware_users_db', JSON.stringify(users));
  }, [users]);

  const updateProject = (id: string, data: Partial<ProjectData>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const addProject = (data: ProjectData) => {
    setProjects(prev => [...prev, data]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const uploadPitchDeck = async (id: string, file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        updateProject(id, { pitchDeckUrl: result });
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file); 
    });
  };

  const logLead = (leadData: Omit<InvestorLead, 'id' | 'timestamp'>) => {
    const newLead: InvestorLead = {
      ...leadData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateUserRole = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    // If the currently logged-in user is updated, we would ideally sync AuthContext,
    // but since AuthContext reads from 'soulware_user' localStorage which is separate from this DB simulation,
    // we will rely on AuthContext logic to handle its own session. 
    // In a real app, this DB update would propagate to the user's session on next refresh.
  };

  return (
    <DataContext.Provider value={{ projects, leads, users, updateProject, addProject, deleteProject, uploadPitchDeck, logLead, updateUserRole }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
