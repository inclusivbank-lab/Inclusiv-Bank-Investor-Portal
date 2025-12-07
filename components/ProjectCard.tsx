import React, { useState } from 'react';
import { ArrowRight, BarChart3, Users, Leaf, ShieldCheck, Mail, Download, X, Loader2, Linkedin, Twitter, Moon, Sun, Image as ImageIcon, Zap, Check } from 'lucide-react';
import { ProjectData, Language } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from "@google/genai";

interface ProjectCardProps {
  project: ProjectData;
  onRequestAccess: (project: ProjectData) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onRequestAccess }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [imgError, setImgError] = useState(!project.imageUrl);
  const [insightLoading, setInsightLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const isInterested = user?.interestedProjectIds?.includes(project.id);

  const getShareUrls = () => {
    const baseUrl = window.location.origin;
    const desc = project.shortDescription[language] || project.shortDescription['en'];
    const shareText = encodeURIComponent(`${t('btn.share')}: ${project.title} - ${desc}`);
    
    return {
      twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(baseUrl)}`,
      linkedin: `https://www.linkedin.com/feed/?shareActive=true&text=${shareText} ${encodeURIComponent(baseUrl)}`
    };
  };

  const handleQuickInsight = async () => {
    if (aiInsight) return;
    setInsightLoading(true);
    try {
      const apiKey = process.env.API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      const desc = project.fullDescription[language] || project.fullDescription['en'];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: [
          { role: 'user', parts: [{ text: `Provide a 1-sentence quick investment highlight for this project: ${desc}` }] }
        ],
        config: {
          thinkingConfig: { thinkingBudget: 0 } 
        }
      });
      setAiInsight(response.text || "Analysis unavailable.");
    } catch (e) {
      console.error(e);
      setAiInsight(language === 'es' ? "No se pudo generar el análisis." : "Could not generate insight.");
    } finally {
      setInsightLoading(false);
    }
  };

  const shareUrls = getShareUrls();
  const shortDesc = project.shortDescription[language] || project.shortDescription['en'];

  const getFallbackIcon = () => {
    const cat = project.category.toLowerCase();
    if (cat.includes('energy') || cat.includes('solar') || cat.includes('climate') || cat.includes('conservation') || cat.includes('biotech') || cat.includes('nature') || cat.includes('forest')) {
      return <Leaf className="w-12 h-12 text-soul-accent/50 mb-2" />;
    }
    if (cat.includes('fintech') || cat.includes('crypto') || cat.includes('blockchain') || cat.includes('web3') || cat.includes('banking') || cat.includes('investing')) {
      return <BarChart3 className="w-12 h-12 text-soul-primary/50 mb-2" />;
    }
    if (cat.includes('social') || cat.includes('education') || cat.includes('edtech') || cat.includes('youth') || cat.includes('hr') || cat.includes('community') || cat.includes('inclusion')) {
      return <Users className="w-12 h-12 text-blue-400/50 mb-2" />;
    }
    return <ImageIcon className="w-12 h-12 text-slate-400/50 mb-2" />;
  };

  return (
    <div className={`group bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-300 overflow-hidden border ${isInterested ? 'border-soul-primary dark:border-soul-primary ring-1 ring-soul-primary' : 'border-slate-100 dark:border-slate-800'} flex flex-col h-full`}>
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {!imgError ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
            <img 
              src={project.imageUrl} 
              alt={`${project.title} - ${project.category}`} 
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 animate-fade-in">
            {getFallbackIcon()}
            <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium opacity-70 text-center">{project.category}</span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 z-20">
          <span className="inline-block px-3 py-1 bg-soul-primary text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-md bg-opacity-90">
            {project.category}
          </span>
        </div>
        {isInterested && (
          <div className="absolute top-4 right-4 z-20">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-md shadow-lg">
              <Check size={12} /> Access Granted
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-soul-primary dark:group-hover:text-soul-primary transition-colors flex-1">
            {project.title}
          </h3>
          <div className="flex gap-2 ml-2 shrink-0">
            <a 
              href={shareUrls.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-[#0077b5] dark:hover:text-[#0077b5] transition-colors p-1"
              title={`${t('btn.share')} on LinkedIn`}
            >
              <Linkedin size={18} />
            </a>
            <a 
              href={shareUrls.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-black dark:hover:text-white transition-colors p-1"
              title={`${t('btn.share')} on X (Twitter)`}
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6 flex-1 line-clamp-3 leading-relaxed">
          {shortDesc}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-semibold">{t('label.ask')}</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{project.fundingAsk}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-semibold">{t('label.valuation')}</p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{project.valuation}</p>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="mb-4 min-h-[28px]">
           {!aiInsight && !insightLoading && (
             <button 
               onClick={handleQuickInsight}
               className="text-xs flex items-center gap-1 text-soul-primary hover:text-blue-600 dark:text-blue-400 font-medium transition-colors"
             >
               <Zap size={14} />
               {language === 'es' ? 'Análisis Rápido' : 'Quick Analysis'}
             </button>
           )}
           {insightLoading && (
             <div className="flex items-center gap-2 text-xs text-slate-500">
               <Loader2 size={14} className="animate-spin" />
               {language === 'es' ? 'Analizando...' : 'Analyzing...'}
             </div>
           )}
           {aiInsight && (
             <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
               <div className="flex items-start gap-2">
                 <Zap size={14} className="text-soul-primary mt-0.5 shrink-0" />
                 <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{aiInsight}"</p>
               </div>
             </div>
           )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-md font-medium border border-slate-200 dark:border-slate-700">
              #{tag}
            </span>
          ))}
        </div>

        <button 
          onClick={() => onRequestAccess(project)}
          className={`w-full py-3 px-4 border-2 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-md mt-auto ${
            isInterested 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30' 
            : 'bg-white dark:bg-slate-800 border-soul-dark dark:border-white text-soul-dark dark:text-white hover:bg-soul-dark dark:hover:bg-white hover:text-white dark:hover:text-soul-dark'
          }`}
        >
          {isInterested ? (language === 'es' ? 'Ver de nuevo' : 'View Again') : t('btn.learnMore')}
          <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;