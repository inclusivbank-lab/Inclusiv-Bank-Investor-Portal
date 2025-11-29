
export type Language = 'en' | 'es' | 'fr' | 'de';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'investor' | 'admin';
}

export type LocalizedContent = {
  [key in Language]: string;
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
  socialLogin: (provider: 'google' | 'linkedin') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  availableLanguages: { code: Language; label: string }[];
}
