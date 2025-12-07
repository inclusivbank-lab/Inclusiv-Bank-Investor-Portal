
import React, { useState, useEffect } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { ProjectData, Language } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

interface GateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
  language?: Language; // kept for compat
}

// --- GOOGLE SHEETS CONFIGURATION ---
// To enable database creation:
// 1. Create a Google Sheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste the following code into the script editor:
/*
  function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var params = e.parameter;
    sheet.appendRow([
      new Date(), 
      params.name, 
      params.email, 
      params.phone, 
      params.project_title, 
      params.project_id
    ]);
    return ContentService.createTextOutput("Success");
  }
*/
// 4. Click Deploy > New Deployment.
// 5. Select type "Web app", set "Who has access" to "Anyone", and click Deploy.
// 6. Copy the Web App URL and paste it below.
const GOOGLE_SHEETS_WEBHOOK_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
// -----------------------------------

const GateModal: React.FC<GateModalProps> = ({ isOpen, onClose, project }) => {
  const { user, updateUser } = useAuth();
  const { t, language } = useLanguage();
  const { logLead } = useData();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    } else {
      setFormData({ name: '', email: '', phone: '' });
    }
    setError('');
  }, [user, isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict validation for Email and Mobile as requested
    if (!formData.email || !formData.phone) {
      setError(language === 'es' ? 'El correo y el móvil son obligatorios.' : 'Email and Mobile number are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    // --- SEND DATA TO GOOGLE SHEETS ---
    try {
      const payload = new FormData();
      payload.append('timestamp', new Date().toISOString());
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('project_title', project.title);
      payload.append('project_id', project.id);
      payload.append('funding_ask', project.fundingAsk);

      if (GOOGLE_SHEETS_WEBHOOK_URL && !GOOGLE_SHEETS_WEBHOOK_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
        await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: payload
        });
        console.log('Investor interest logged to database.');
      }
    } catch (err) {
      console.error('Failed to log data to sheets:', err);
    }
    // ----------------------------------

    // --- LOG LEAD INTERNALLY ---
    logLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      projectTitle: project.title,
      projectId: project.id
    });
    // ---------------------------

    // --- UPDATE LOCAL USER INTEREST ---
    if (user) {
      const currentInterests = user.interestedProjectIds || [];
      if (!currentInterests.includes(project.id)) {
        updateUser({ interestedProjectIds: [...currentInterests, project.id] });
      }
    }
    // ----------------------------------

    console.log(`Lead Captured for ${project.id}:`, formData);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // DOWNLOAD LOGIC
      if (project.pitchDeckUrl) {
        // Download actual uploaded file (Data URI)
        const link = document.createElement("a");
        link.href = project.pitchDeckUrl;
        link.download = `${project.id}_pitch_deck.pdf`; // Defaulting to PDF extension for download name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback to text file
        const element = document.createElement("a");
        const fileContent = `Thank you for your interest in ${project.title}.\n\nThis is a placeholder for the pitch deck PDF because the admin has not uploaded a file yet.\n\nProject: ${project.title}\nCategory: ${project.category}\nFunding Ask: ${project.fundingAsk}\n\nLead Info:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}`;
        const file = new Blob([fileContent], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${project.id}_info_sheet.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
      
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);
    }, 1500);
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
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-soul-primary/10 text-soul-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Download size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
              {isSuccess ? t('gate.success') : t('gate.title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {isSuccess ? t('gate.checkFolder') : `${t('gate.subtitle')} ${project.title}.`}
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.name')}</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 bg-white dark:bg-slate-800 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  readOnly={!!user?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.email')} <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 bg-white dark:bg-slate-800 dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  readOnly={!!user?.email}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('auth.phone')} <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 bg-white dark:bg-slate-800 dark:text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  readOnly={!!user?.phone}
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
                    <Download size={20} />
                    {t('gate.download')}
                  </>
                )}
              </button>
              
              <p className="text-xs text-slate-400 text-center mt-4">
                {t('gate.privacy')}
              </p>
            </form>
          ) : (
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
