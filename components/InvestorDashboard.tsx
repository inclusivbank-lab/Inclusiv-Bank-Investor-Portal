
import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { PieChart, TrendingUp, Bell, ArrowRight, FileText, Calendar, Wallet, Mail, User, Save } from 'lucide-react';
import ProjectCard from './ProjectCard';

const InvestorDashboard: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const { user, updateUser } = useAuth();
  const { projects } = useData();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  
  // Settings Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const interestedProjects = useMemo(() => {
    if (!user?.interestedProjectIds) return [];
    return projects.filter(p => user.interestedProjectIds?.includes(p.id));
  }, [projects, user]);

  const notifications = useMemo(() => {
    // Simulated notifications based on interested projects
    const updates = [
      { id: 1, type: 'news', text: 'Quarterly ecosystem report released', date: '2d ago' },
    ];
    
    interestedProjects.forEach(p => {
        updates.push({
            id: Math.random(),
            type: 'update',
            text: `New funding milestone reached for ${p.title}`,
            date: '1d ago'
        });
        updates.push({
            id: Math.random(),
            type: 'event',
            text: `Founder webinar scheduled for ${p.title}`,
            date: 'Just now'
        });
    });
    
    return updates.sort(() => Math.random() - 0.5); // Shuffle for demo
  }, [interestedProjects]);

  if (!user) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      updateUser({
        name: formData.name,
        phone: formData.phone
        // Email usually requires re-verification, so we might skip it or allow it for demo
      });
      setIsSaving(false);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-soul-dark pt-8 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">
              {t('dashboard.welcome')}, {user.name.split(' ')[0]}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {t('dashboard.subtitle')}
            </p>
          </div>
          
          <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-soul-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'bg-soul-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <User size={16} /> Profile
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-soul-primary rounded-xl">
                    <PieChart size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.statPortfolio')}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{interestedProjects.length} Projects</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.statImpact')}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">High</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.statStatus')}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">Active</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content: Projects */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('dashboard.yourInterests')}</h2>
                  {interestedProjects.length > 0 && (
                    <button 
                      onClick={onExplore}
                      className="text-soul-primary text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      {t('dashboard.exploreMore')} <ArrowRight size={16} />
                    </button>
                  )}
                </div>

                {interestedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interestedProjects.map(project => (
                      <div key={project.id} className="h-full">
                         <ProjectCard 
                            project={project} 
                            onRequestAccess={() => {}} 
                         />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <FileText size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('dashboard.emptyTitle')}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                      {t('dashboard.emptyDesc')}
                    </p>
                    <button 
                      onClick={onExplore}
                      className="px-6 py-3 bg-soul-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                      {t('dashboard.startExploring')}
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar: Notifications & Contact */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Bell size={20} />
                    {t('dashboard.updates')}
                  </h2>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                    <div className="space-y-6">
                      {notifications.map((note, idx) => (
                        <div key={note.id} className="flex gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${note.type === 'update' ? 'bg-green-500' : note.type === 'event' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">{note.text}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar size={12} />
                              {note.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Mail size={20} className="text-soul-primary" />
                    {t('section.contact')}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Have questions about your portfolio? Our investor relations team is here to help.
                  </p>
                  <a 
                    href="mailto:investors@inclusivbank.lat" 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-slate-800 text-soul-primary font-semibold rounded-xl shadow-sm hover:shadow-md transition-all text-sm group"
                  >
                    <span className="group-hover:underline">Contact Support</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* SETTINGS TAB */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary outline-none bg-white dark:bg-slate-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">To change your email, please contact support.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 555 000 0000"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary outline-none bg-white dark:bg-slate-800 dark:text-white"
                  />
                  <p className="text-xs text-slate-500 mt-1">Required for document access.</p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {saveMessage ? (
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium animate-fade-in">
                      {saveMessage}
                    </span>
                  ) : <span></span>}
                  
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-soul-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                  >
                    {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;
