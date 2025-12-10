
import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, Building2, MessageSquare } from 'lucide-react';
import { ProjectData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface GateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
}

const GateModal: React.FC<GateModalProps> = ({ isOpen, onClose, project }) => {
  const { t, language } = useLanguage();
  const { logLead } = useData();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
        setFormData({ name: '', email: '', phone: '', company: '' });
        setIsSuccess(false);
        setError('');
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.phone) {
      setError(language === 'es' ? 'El correo y el móvil son obligatorios.' : 'Email and Mobile number are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
        // --- LOG LEAD INTERNALLY (SUPABASE) ---
        await logLead({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            projectTitle: project.title,
            projectId: project.id
        });

        setIsSubmitting(false);
        setIsSuccess(true);
        
        // Show success and close, NO DOWNLOAD
        setTimeout(() => {
            onClose();
            setIsSuccess(false);
        }, 4000);

    } catch (err) {
        console.error("Submission failed", err);
        setError("An error occurred. Please try again.");
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in relative border border-slate-100 dark:border-slate-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-soul-primary/10 text-soul-primary`}>
              <MessageSquare size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
              {isSuccess ? t('gate.success') : t('gate.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {isSuccess 
                ? t('gate.checkFolder') 
                : `${t('gate.subtitle')} ${project.title}.`
              }
            </p>
          </div>

          {/* Form */}
          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.name')}</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 dark:text-white"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Acme Ventures"
                  />
                  <Building2 className="absolute right-3 top-2.5 text-slate-400" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.email')} <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="investor@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.phone')} <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all bg-white dark:bg-slate-800 dark:text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
                  {error}
                </p>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-soul-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={20} />
                    {t('gate.download')}
                  </>
                )}
              </button>
              
              <div className="text-center mt-4 space-y-2">
                <p className="text-xs text-slate-400">
                  {t('gate.privacy')}
                </p>
                <p className="text-xs text-soul-primary font-medium">
                  Support: investors@inclusivbank.lat
                </p>
              </div>
            </form>
          )}

          {isSuccess && (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GateModal;
