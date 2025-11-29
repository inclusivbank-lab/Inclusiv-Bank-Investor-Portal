
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProjectData, DataContextType } from '../types';
import { projects as initialProjects } from '../data';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    const saved = localStorage.getItem('soulware_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  useEffect(() => {
    localStorage.setItem('soulware_projects', JSON.stringify(projects));
  }, [projects]);

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
    // In a real app, this would upload to S3/Firebase Storage
    // Here we simulate it by creating a local object URL or fake path
    // Note: Local Object URLs are temporary, but for this demo we'll return a data URI
    // to allow persistence in localStorage (be mindful of quota limits in real usage)
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Update the project with this "URL"
        updateProject(id, { pitchDeckUrl: result });
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file); 
    });
  };

  return (
    <DataContext.Provider value={{ projects, updateProject, addProject, deleteProject, uploadPitchDeck }}>
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
