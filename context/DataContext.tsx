
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProjectData, DataContextType, InvestorLead, User } from '../types';
import { supabase } from '../supabaseClient';
import { projects as initialProjects } from '../data';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [leads, setLeads] = useState<InvestorLead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // 1. Fetch Projects
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*');
      
      if (projectError) {
        console.error('Error fetching projects:', projectError);
        // Fallback to local data if DB is empty or error
        if (projectData?.length === 0) setProjects(initialProjects);
      } else {
        // Map snake_case DB fields to camelCase TS interfaces if needed, 
        // but currently we assume column names match or we map them here.
        // Assuming DB columns: id, title, short_description, full_description, etc.
        const mappedProjects: ProjectData[] = projectData.map((p: any) => ({
          id: p.id,
          title: p.title,
          shortDescription: p.short_description || {},
          fullDescription: p.full_description || {},
          fundingAsk: p.funding_ask,
          valuation: p.valuation,
          category: p.category,
          tags: p.tags || [],
          imageUrl: p.image_url,
          pitchDeckUrl: p.pitch_deck_url
        }));
        
        if (mappedProjects.length === 0) {
          // If DB is empty, use initial data (and maybe upload it?)
          setProjects(initialProjects);
        } else {
          setProjects(mappedProjects);
        }
      }

      // 2. Fetch Leads (Admin only usually, but we fetch all for context simplicity)
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (leadsData) {
        const mappedLeads: InvestorLead[] = leadsData.map((l: any) => ({
          id: l.id,
          name: l.name,
          email: l.email,
          phone: l.phone,
          projectTitle: l.project_title,
          projectId: l.project_id,
          timestamp: l.timestamp
        }));
        setLeads(mappedLeads);
      }

      // 3. Fetch Users (for Admin Panel)
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*');
        
      if (usersData) {
        const mappedUsers: User[] = usersData.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          interestedProjectIds: u.interested_projects
        }));
        setUsers(mappedUsers);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const updateProject = async (id: string, data: Partial<ProjectData>) => {
    // Optimistic Update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));

    const dbUpdates: any = {};
    if (data.title) dbUpdates.title = data.title;
    if (data.fundingAsk) dbUpdates.funding_ask = data.fundingAsk;
    if (data.valuation) dbUpdates.valuation = data.valuation;
    if (data.category) dbUpdates.category = data.category;
    if (data.pitchDeckUrl) dbUpdates.pitch_deck_url = data.pitchDeckUrl;

    const { error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', id);

    if (error) console.error('Error updating project:', error);
  };

  const addProject = async (data: ProjectData) => {
    setProjects(prev => [...prev, data]);
    
    // Convert to DB format
    const dbProject = {
      id: data.id,
      title: data.title,
      short_description: data.shortDescription,
      full_description: data.fullDescription,
      funding_ask: data.fundingAsk,
      valuation: data.valuation,
      category: data.category,
      tags: data.tags,
      image_url: data.imageUrl,
      pitch_deck_url: data.pitchDeckUrl
    };

    const { error } = await supabase.from('projects').insert([dbProject]);
    if (error) console.error('Error adding project:', error);
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    await supabase.from('projects').delete().eq('id', id);
  };

  const uploadPitchDeck = async (id: string, file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pitch-decks')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('pitch-decks')
        .getPublicUrl(filePath);

      await updateProject(id, { pitchDeckUrl: data.publicUrl });
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const logLead = async (leadData: Omit<InvestorLead, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString();
    
    // DB Insert
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        project_title: leadData.projectTitle,
        project_id: leadData.projectId,
        timestamp: timestamp
      }])
      .select()
      .single();

    if (error) {
      console.error('Error logging lead:', error);
      return;
    }

    if (data) {
      const newLead: InvestorLead = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        projectTitle: data.project_title,
        projectId: data.project_id,
        timestamp: data.timestamp
      };
      setLeads(prev => [newLead, ...prev]);
    }
  };

  const updateUserRole = async (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
  };

  return (
    <DataContext.Provider value={{ projects, leads, users, updateProject, addProject, deleteProject, uploadPitchDeck, logLead, updateUserRole, isLoading }}>
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
