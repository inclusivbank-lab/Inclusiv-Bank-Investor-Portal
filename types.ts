
export type Language = 'en' | 'es' | 'fr' | 'de';

export type LocalizedContent = {
  [key in Language]?: string;
} & {
  en: string; // English is mandatory fallback
};

export interface ProjectData {
  id: string;
  title: string;
  shortDescription: LocalizedContent;
  fullDescription: LocalizedContent;
  fundingAsk: string;
  valuation?: string;
  category: string;
  tags: string[];
  imageUrl: string;
  pitchDeckUrl?: string; // New field for uploaded files
}

export interface InvestorLead {
  id: string;
  name: string;
  email: string;
  company?: string; // Added company field
  phone: string;
  projectTitle: string;
  projectId: string;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'limited' | 'investor' | 'admin';
  interestedProjectIds?: string[];
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; label: string }[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

export interface DataContextType {
  projects: ProjectData[];
  leads: InvestorLead[];
  users: User[];
  isLoading: boolean;
  updateProject: (id: string, data: Partial<ProjectData>) => Promise<void>;
  addProject: (data: ProjectData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  uploadPitchDeck: (id: string, file: File) => Promise<string>;
  logLead: (lead: Omit<InvestorLead, 'id' | 'timestamp'>) => Promise<void>;
  updateUserRole: (id: string, role: User['role']) => Promise<void>;
}
