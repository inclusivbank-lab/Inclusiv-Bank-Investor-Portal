
import React, { useState, useEffect } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { ProjectData, Language } from '../types';
import { useAuth } from '../context/AuthContext';

interface GateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData | null;
  language: Language;
}

const GateModal: React.FC<GateModalProps> = ({ isOpen, onClose, project, language }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
  }, [user, isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would send data to a backend
    console.log(`Lead Captured for ${project.id}:`, formData);

    // Simulate API call and Download
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      const element = document.createElement("a");
      const fileContent = `Thank you for your interest in ${project.title}.\n\nThis is a placeholder for the pitch deck PDF.\n\nProject: ${project.title}\nCategory: ${project.category}\nFunding Ask: ${project.fundingAsk}\n\nLead Info:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}`;
      const file = new Blob([fileContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${project.id}_pitch_deck.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  const t = {
    title: language === 'en' ? 'Access Investor Documents' : 'Acceder a Documentos de Inversión',
    subtitle: language === 'en' ? `Please confirm your details to download the pitch deck for ${project.title}.` : `Por favor confirme sus datos para descargar el pitch deck de ${project.title}.`,
    name: language === 'en' ? 'Full Name' : 'Nombre Completo',
    email: language === 'en' ? 'Email Address' : 'Correo Electrónico',
    phone: language === 'en' ? 'Mobile Number' : 'Número de Móvil',
    submit: language === 'en' ? 'Download Pitch Deck' : 'Descargar Pitch Deck',
    success: language === 'en' ? 'Download Started!' : '¡Descarga Iniciada!',
    privacy: language === 'en' ? 'Your information is secure and will only be used to contact you regarding this opportunity.' : 'Su información está segura y solo se utilizará para contactarlo sobre esta oportunidad.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-soul-primary/10 text-soul-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Download size={24} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              {isSuccess ? t.success : t.title}
            </h3>
            <p className="text-slate-600 text-sm">
              {isSuccess ? 'Check your downloads folder.' : t.subtitle}
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.name}</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  readOnly={!!user?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.email}</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  readOnly={!!user?.email}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.phone}</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  readOnly={!!user?.phone}
                />
              </div>

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
                    {t.submit}
                  </>
                )}
              </button>
              
              <p className="text-xs text-slate-400 text-center mt-4">
                {t.privacy}
              </p>
            </form>
          ) : (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
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
