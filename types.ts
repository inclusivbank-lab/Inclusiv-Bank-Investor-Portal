
export type Language = 'en' | 'es';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'investor' | 'admin';
}

export interface ProjectData {
  id: string;
  title: string;
  shortDescription: {
    en: string;
    es: string;
  };
  fullDescription: {
    en: string;
    es: string;
  };
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
