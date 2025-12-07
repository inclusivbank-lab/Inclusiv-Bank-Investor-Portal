
import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language; 
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.phone, formData.password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
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
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
              {mode === 'login' ? t('auth.welcome') : t('auth.create')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('auth.investorAccess')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder={t('auth.name')}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none bg-white dark:bg-slate-800 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    placeholder={t('auth.phone')}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none bg-white dark:bg-slate-800 dark:text-white"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder={t('auth.email')}
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none bg-white dark:bg-slate-800 dark:text-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder={t('auth.password')}
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-