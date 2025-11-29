import React, { useState } from 'react';
import { Globe, ArrowRight, BarChart3, Users, Leaf, ShieldCheck, Mail, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { projects } from './data';
import GateModal from './components/GateModal';
import AuthModal from './components/AuthModal';
import { ProjectData, Language } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

const NavBar = ({ 
  language, 
  toggleLanguage, 
  onLoginClick 
}: { 
  language: Language; 
  toggleLanguage: () => void; 
  onLoginClick: () => void; 
}) => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-soul-primary to-soul-accent rounded-lg"></div>
            <span className="font-serif text-xl font-bold text-slate-900 tracking-tight">Soulware<span className="text-soul-primary">Inv</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 font-medium text-sm"
            >
              <Globe size={18} />
              <span className="hidden sm:inline">{language === 'en' ? 'English' : 'Español'}</span>
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                  <span className="text-xs text-slate-500 uppercase">{user.role}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title={language === 'en' ? 'Sign Out' : 'Cerrar Sesión'}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 bg-soul-dark text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                <LogIn size={16} />
                <span>{language === 'en' ? 'Log In / Sign Up' : 'Entrar / Registro'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const MainContent = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'es' : 'en');

  const handleRequestAccess = (project: ProjectData) => {
    if (!user) {
      // If not logged in, force auth first
      setIsAuthOpen(true);
      // We could store the intended project to open after login, 
      // but for simplicity we'll just ask them to login.
    } else {
      setSelectedProject(project);
      setIsGateOpen(true);
    }
  };

  const t = {
    heroTitle: language === 'en' ? 'Technology for the Human Soul' : 'Tecnología para el Alma Humana',
    heroSubtitle: language === 'en' 
      ? 'A curated ecosystem of high-impact ventures blending fintech, sustainability, and social equity. Discover the future of conscientious investment.' 
      : 'Un ecosistema curado de empresas de alto impacto que combinan fintech, sostenibilidad y equidad social. Descubra el futuro de la inversión consciente.',
    opportunities: language === 'en' ? 'Investment Opportunities' : 'Oportunidades de Inversión',
    learnMore: language === 'en' ? 'Request Access' : 'Solicitar Acceso',
    valuation: language === 'en' ? 'Valuation' : 'Valoración',
    ask: language === 'en' ? 'Ask' : 'Solicitud',
    contactTitle: language === 'en' ? 'Questions? Contact Us' : '¿Preguntas? Contáctenos',
    contactText: language === 'en' 
      ? 'Need more specific information about the ecosystem or a specific venture? Our team is ready to assist.'
      : '¿Necesita información más específica sobre el ecosistema o una empresa específica? Nuestro equipo está listo para ayudar.',
    contactBtn: language === 'en' ? 'Get in Touch' : 'Contáctenos'
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <NavBar 
        language={language} 
        toggleLanguage={toggleLanguage} 
        onLoginClick={() => setIsAuthOpen(true)} 
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-soul-dark text-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-soul-dark"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
            {t.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-soul-accent" />
              <span>High ROI Potential</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-soul-primary" />
              <span>Social Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="text-green-400" />
              <span>Sustainability</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-400" />
              <span>Blockchain Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-slate-50" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-serif text-4xl font-bold text-slate-900">{t.opportunities}</h2>
            <div className="h-1 w-24 bg-soul-primary hidden sm:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="inline-block px-3 py-1 bg-soul-primary text-white text-xs font-bold rounded-full mb-2">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-soul-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 flex-1 line-clamp-3">
                    {language === 'en' ? project.shortDescription.en : project.shortDescription.es}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.ask}</p>
                      <p className="font-bold text-slate-900">{project.fundingAsk}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.valuation}</p>
                      <p className="font-bold text-slate-900">{project.valuation}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleRequestAccess(project)}
                    className="w-full py-3 px-4 bg-white border-2 border-soul-dark text-soul-dark font-bold rounded-lg hover:bg-soul-dark hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    {t.learnMore}
                    <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block p-4 bg-blue-50 rounded-full text-soul-primary mb-6">
            <Mail size={32} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">{t.contactTitle}</h2>
          <p className="text-slate-600 text-lg mb-8">
            {t.contactText}
          </p>
          <a 
            href="mailto:investors@inclusivbank.lat"
            className="inline-flex items-center gap-2 bg-soul-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {t.contactBtn}
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-soul-dark text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm">
            © 2025 Soulware Ecosystem. All rights reserved.
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
        language={language}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        language={language}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;