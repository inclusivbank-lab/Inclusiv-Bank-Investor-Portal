
import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { PieChart, TrendingUp, Bell, ArrowRight, FileText, Calendar, Wallet, Mail } from 'lucide-react';
import ProjectCard from './ProjectCard';

const InvestorDashboard: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const { user } = useAuth();
  const { projects } = useData();
  const { t, language } = useLanguage();

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-soul-dark pt-8 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            {t('dashboard.welcome')}, {user.name.split(' ')[0]}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('dashboard.subtitle')}
          </p>
        </div>

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
                     {/* We reuse project card but we disable the request access modal since they already have it, 
                         or we could let them download again. For simplicity, we pass onExplore or a no-op */}
                     <ProjectCard 
                        project={project} 
                        onRequestAccess={() => {}} // Could open details
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
                <button className="w-full mt-6 py-2 text-sm text-slate-500 hover:text-soul-primary transition-colors border-t border-slate-100 dark:border-slate-800 pt-4">
                  View all notifications
                </button>
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
                <span className="group-hover:underline">investors@inclusivbank.lat</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;
