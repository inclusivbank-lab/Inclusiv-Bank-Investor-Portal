
import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const t = {
    loginTitle: language === 'en' ? 'Welcome Back' : 'Bienvenido de Nuevo',
    registerTitle: language === 'en' ? 'Create Account' : 'Crear Cuenta',
    name: language === 'en' ? 'Full Name' : 'Nombre Completo',
    email: language === 'en' ? 'Email Address' : 'Correo Electrónico',
    phone: language === 'en' ? 'Mobile Number' : 'Número de Móvil',
    password: language === 'en' ? 'Password' : 'Contraseña',
    loginBtn: language === 'en' ? 'Log In' : 'Iniciar Sesión',
    registerBtn: language === 'en' ? 'Sign Up' : 'Registrarse',
    switchRegister: language === 'en' ? "Don't have an account? Sign up" : "¿No tienes cuenta? Regístrate",
    switchLogin: language === 'en' ? "Already have an account? Log in" : "¿Ya tienes cuenta? Inicia sesión",
    investorRole: language === 'en' ? 'Investor Portal Access' : 'Acceso al Portal de Inversores'
  };

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
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">
              {mode === 'login' ? t.loginTitle : t.registerTitle}
            </h3>
            <p className="text-slate-500 text-sm">{t.investorRole}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder={t.name}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    placeholder={t.phone}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none"
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
                placeholder={t.email}
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder={t.password}
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-soul-primary focus:border-transparent outline-none"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-soul-dark hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? t.loginBtn : t.registerBtn)}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-soul-primary hover:text-blue-700 text-sm font-medium"
            >
              {mode === 'login' ? t.switchRegister : t.switchLogin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
