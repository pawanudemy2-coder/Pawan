
import React, { useState } from 'react';
import { Project } from '../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id' | 'feedbacks' | 'createdAt' | 'status'>) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    owner: 'Alex Chen',
    codeSnippet: '',
    thumbnail: 'https://picsum.photos/800/400'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      owner: 'Alex Chen',
      codeSnippet: '',
      thumbnail: 'https://picsum.photos/800/400'
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">Draft New Application</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., decentralized music player"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="What does your app do? Who is it for?"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white h-24 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Logic / Code Draft</label>
            <textarea 
              value={formData.codeSnippet}
              onChange={e => setFormData({...formData, codeSnippet: e.target.value})}
              placeholder="Paste your main logic here..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-indigo-300 font-mono text-sm h-40 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold transition-all border border-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30"
            >
              Start Collaborative Testing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
