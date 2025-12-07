
export type Language = 'en' | 'es' | 'fr' | 'de';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'investor' | 'admin';
  interestedProjectIds?: string[];
}

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
  name: string;
  email: string;
  phone: string;
  projectInterest: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; label: string }[];
}

export interface DataContextType {
  projects: ProjectData[];
  updateProject: (id: string, data: Partial<ProjectData>) => void;
  addProject: (data: ProjectData) => void;
  deleteProject: (id: string) => void;
  uploadPitchDeck: (id: string, file: File) => Promise<string>;
}