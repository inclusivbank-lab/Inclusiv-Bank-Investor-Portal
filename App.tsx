
import React, { useState, useEffect } from 'react';
import { Globe, ArrowRight, BarChart3, Users, Leaf, ShieldCheck, Mail, LogIn, LogOut, User as UserIcon, Linkedin, Twitter, Moon, Sun, ChevronDown, Settings } from 'lucide-react';
import GateModal from './components/GateModal';
import AuthModal from './components/AuthModal';
import ChatBot from './components/ChatBot';
import ProjectCard from './components/ProjectCard';
import AdminPanel from './components/AdminPanel';
import { ProjectData } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider, useData } from './context/DataContext';

const NavBar = ({ 
  onLoginClick,
  isDark,
  toggleTheme,
  onAdminClick
}: { 
  onLoginClick: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  onAdminClick: () => void;
}) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-soul-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            {/* Logo Image - Please ensure 'logo.png' is in your public folder */}
            <img 
              src="/logo.png" 
              alt="Soulware Ecosystem" 
              className="h-20 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                // Fallback if image fails to load
                e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="font-serif text-xl font-bold text-slate-900 dark:text-white tracking-tight">Soulware<span class="text-soul-primary">Inv</span></span>');
              }}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 font-medium text-sm"
              >
                <Globe size={18} />
                <span className="hidden sm:inline uppercase">{language}</span>
                <ChevronDown size={14} />
              </button>
              
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${language === lang.code ? 'font-bold text-soul-primary' : 'text-slate-700 dark:text-slate-300'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">{user.role}</span>
                </div>
                
                {user.role === 'admin' && (
                  <button
                    onClick={onAdminClick}
                    className="p-2 text-soul-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                    title="Admin Panel"
                  >
                    <Settings size={20} />
                  </button>
                )}

                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  title={t('nav.logout')}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 bg-soul-dark dark:bg-white text-white dark:text-soul-dark rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors text-sm font-medium"
              >
                <LogIn size={16} />
                <span>{t('nav.login')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const MainContent = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const { user } = useAuth();
  const { projects } = useData();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleRequestAccess = (project: ProjectData) => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setSelectedProject(project);
      setIsGateOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-soul-dark font-sans pb-20 transition-colors duration-300">
      <NavBar 
        onLoginClick={() => setIsAuthOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-soul-dark text-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-soul-dark dark:to-soul-dark"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-soul-accent" />
              <span>{t('label.highRoi')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-soul-primary" />
              <span>{t('label.socialImpact')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="text-green-400" />
              <span>{t('label.sustainability')}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-400" />
              <span>{t('label.blockchain')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-slate-50 dark:bg-soul-dark transition-colors duration-300" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">{t('section.opportunities')}</h2>
            <div className="h-1 w-24 bg-soul-primary hidden sm:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onRequestAccess={handleRequestAccess} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white dark:bg-slate-900 py-20 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full text-soul-primary mb-6">
            <Mail size={32} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('section.contact')}</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
            {t('section.contactDesc')}
          </p>
          <a 
            href="mailto:investors@inclusivbank.lat"
            className="inline-flex items-center gap-2 bg-soul-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {t('btn.contact')}
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-soul-dark text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm">
            © 2025 Soulware Ecosystem. {t('footer.rights')}
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
          </div>
        </div>
      </footer>

      <GateModal 
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        project={selectedProject}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      {isAdminOpen && (
        <AdminPanel onClose={() => setIsAdminOpen(false)} />
      )}

      <ChatBot />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <MainContent />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
