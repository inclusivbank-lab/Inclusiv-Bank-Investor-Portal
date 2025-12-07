
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Save, Upload, Trash2, X, CheckCircle, Users, LayoutList, Shield, User as UserIcon, Lock } from 'lucide-react';
import { User } from '../types';

const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { projects, leads, users, updateProject, uploadPitchDeck, updateUserRole } = useData();
  const { user: currentUser } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'leads' | 'users'>('projects');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">You must be logged in as <strong>investors@inclusivbank.lat</strong> to view this panel.</p>
          <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingId(projectId);
      try {
        await uploadPitchDeck(projectId, e.target.files[0]);
        // Simulate network delay
        setTimeout(() => setUploadingId(null), 1000);
      } catch (err) {
        console.error("Upload failed", err);
        setUploadingId(null);
      }
    }
  };

  const handleSave = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    updateProject(id, {
      title: formData.get('title') as string,
      fundingAsk: formData.get('fundingAsk') as string,
      valuation: formData.get('valuation') as string,
      category: formData.get('category') as string,
    });
    setEditingId(null);
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs font-bold flex items-center gap-1 w-fit"><Shield size={12}/> Admin</span>;
      case 'investor':
        return <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded text-xs font-bold flex items-center gap-1 w-fit"><UserIcon size={12}/> Investor</span>;
      default:
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded text-xs font-bold flex items-center gap-1 w-fit"><Lock size={12}/> Limited</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage pitch decks, project data, and user permissions</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
            <X size={24} className="text-slate-900 dark:text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'projects' ? 'bg-soul-primary text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            <LayoutList size={18} /> Projects & Decks
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'leads' ? 'bg-soul-primary text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            <Users size={18} /> Leads
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'users' ? 'bg-soul-primary text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            <Shield size={18} /> User Management
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {activeTab === 'projects' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Project</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Funding Ask</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Pitch Deck</th>
                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-4">
                        {editingId === project.id ? (
                          <form id={`form-${project.id}`} onSubmit={(e) => handleSave(project.id, e)}>
                            <input name="title" defaultValue={project.title} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                          </form>
                        ) : (
                          <div className="flex items-center gap-3">
                            <img src={project.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                            <span className="font-medium text-slate-900 dark:text-white">{project.title}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        {editingId === project.id ? (
                          <input form={`form-${project.id}`} name="category" defaultValue={project.category} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                        ) : project.category}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        {editingId === project.id ? (
                          <input form={`form-${project.id}`} name="fundingAsk" defaultValue={project.fundingAsk} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                        ) : project.fundingAsk}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {project.pitchDeckUrl ? (
                            <span className="flex items-center gap-1 text-green-500 text-sm font-medium">
                              <CheckCircle size={14} /> Uploaded
                            </span>
                          ) : (
                            <span className="text-slate-400 text-sm">No file</span>
                          )}
                          <label className="cursor-pointer p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors ml-2">
                            {uploadingId === project.id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-soul-primary border-t-transparent rounded-full" />
                            ) : (
                              <Upload size={16} className="text-slate-600 dark:text-slate-300" />
                            )}
                            <input 
                              type="file" 
                              accept=".pdf,.ppt,.pptx" 
                              className="hidden" 
                              onChange={(e) => handleFileUpload(e, project.id)}
                            />
                          </label>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {editingId === project.id ? (
                          <button 
                            type="submit" 
                            form={`form-${project.id}`}
                            className="px-3 py-1 bg-soul-primary text-white rounded hover:bg-blue-600 text-sm"
                          >
                            Save
                          </button>
                        ) : (
                          <button 
                            onClick={() => setEditingId(project.id)}
                            className="px-3 py-1 text-slate-500 hover:text-soul-primary dark:text-slate-400 transition-colors text-sm"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="overflow-x-auto">
              {leads.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                      <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                      <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Investor Name</th>
                      <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Contact Info</th>
                      <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Project Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {new Date(lead.timestamp).toLocaleDateString()} {new Date(lead.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="p-4 font-medium text-slate-900 dark:text-white">
                          {lead.name}
                        </td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1"><span className="opacity-50 w-4">@</span> {lead.email}</span>
                            <span className="flex items-center gap-1"><span className="opacity-50 w-4">#</span> {lead.phone}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-soul-primary text-xs font-bold rounded-md">
                            {lead.projectTitle}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No Leads Yet</h3>
                  <p>Investors who download pitch decks will appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                     <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Name</th>
                     <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Email</th>
                     <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Current Role</th>
                     <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Permission</th>
                   </tr>
                 </thead>
                 <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="p-4 font-medium text-slate-900 dark:text-white">{u.name}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="p-4">{getRoleBadge(u.role)}</td>
                        <td className="p-4 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value as User['role'])}
                            disabled={u.email === 'investors@inclusivbank.lat'} // Prevent lockout of main admin
                            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-soul-primary outline-none"
                          >
                            <option value="limited">Limited</option>
                            <option value="investor">Investor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
