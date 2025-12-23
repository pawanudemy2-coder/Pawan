
import React, { useState, useRef } from 'react';
import { Project, Feedback, FeedbackType } from '../types';
import { geminiService } from '../services/geminiService';
import FeedbackList from './FeedbackList';

interface ProjectDetailProps {
  project: Project;
  onAddFeedback: (f: Omit<Feedback, 'id' | 'timestamp'>) => void;
  onStatusChange: (status: Project['status']) => void;
  onVote: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onAddFeedback, onStatusChange, onVote }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'testing' | 'feedbacks'>('testing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeCode(project.title, project.codeSnippet);
      setAnalysis(result);
    } catch (e) {
      setAnalysis("Error analyzing code. Please check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoteClick = () => {
    if (!hasVoted) {
      onVote();
      setHasVoted(true);
    }
  };

  const handlePostFeedback = (type: FeedbackType) => {
    if (!feedbackText && !mediaFile && type === FeedbackType.TEXT) return;
    let content = feedbackText;
    if (mediaFile) content = URL.createObjectURL(mediaFile);
    onAddFeedback({ author: 'Current User', type, content });
    setFeedbackText('');
    setMediaFile(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-8 rounded-3xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded uppercase">Submission</span>
                <span className="text-[10px] text-slate-500">Challenge: Weather App</span>
              </div>
              <h1 className="text-4xl font-black text-white">{project.title}</h1>
              <p className="text-slate-400 mt-2 text-lg">by {project.owner}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleVoteClick}
                disabled={hasVoted}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-xl ${
                  hasVoted 
                  ? 'bg-emerald-500 text-white cursor-default' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 shadow-indigo-600/20'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a2 2 0 00-.8 1.6V10.333z" />
                </svg>
                {hasVoted ? 'Voted' : `Upvote (${project.votes})`}
              </button>
            </div>
          </div>
          
          <div className="flex border-b border-slate-700/50 mt-12 mb-8">
            {(['testing', 'code', 'feedbacks'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-400 rounded-t-full" />}
              </button>
            ))}
          </div>

          {activeTab === 'testing' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden relative flex items-center justify-center border border-slate-800 group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                <div className="text-center p-8 z-10">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/40 group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-black text-2xl tracking-tight">Interactive Sandbox</h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto italic">Explore Alex's version of the Weather App. Test API connectivity and responsive design.</p>
                  <button className="mt-8 bg-white text-indigo-950 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg">
                    Launch Version
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Technical Feedback Note
                </h4>
                <div className="flex flex-col gap-4">
                  <textarea 
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell the developer what you think of this version..."
                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => fileInputRef.current?.click()} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all border border-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button onClick={() => setIsRecording(!isRecording)} className={`p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700 ${isRecording ? 'text-red-500 ring-2 ring-red-500/50' : 'text-slate-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    </div>
                    <button 
                      onClick={() => handlePostFeedback(FeedbackType.TEXT)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                    >
                      Post Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="ml-4 text-xs font-mono text-slate-500 uppercase tracking-widest">WeatherController.js</span>
                  </div>
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="text-xs bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-1.5 rounded-lg font-bold transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Reviewing...' : 'Gemini AI Review'}
                  </button>
                </div>
                <pre className="p-8 text-sm font-mono text-indigo-300/80 overflow-x-auto leading-relaxed">
                  <code>{project.codeSnippet}</code>
                </pre>
              </div>

              {analysis && (
                <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="p-1.5 bg-indigo-500 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95L12.5 7h5a1 1 0 01.745 1.666l-9 10a1 1 0 01-1.583-1.166L9.5 13H4.5a1 1 0 01-.745-1.666l9-10a1 1 0 01.545-.287z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <h5 className="text-lg font-bold text-white">AI Technical Feedback</h5>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed prose prose-invert max-w-none">
                    {analysis}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'feedbacks' && (
            <FeedbackList feedbacks={project.feedbacks} />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass p-6 rounded-3xl border-indigo-500/10">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-indigo-500 rounded-full" />
            Comparison Stats
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500 font-bold uppercase">Popularity Rank</span>
                <span className="text-xs font-bold text-indigo-400">#1 of 3</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-gradient-to-r from-indigo-600 to-indigo-400" />
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500 font-bold uppercase">Code Maturity</span>
                <span className="text-xs font-bold text-emerald-400">High</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[72%] h-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border-indigo-500/10">
          <h2 className="text-lg font-bold text-white mb-6">Top Testers for this version</h2>
          <div className="space-y-4">
            {['Sarah J.', 'Mike R.', 'Dev Dave'].map((name, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <img src={`https://picsum.photos/seed/${name}/32`} className="w-8 h-8 rounded-full border border-slate-700 group-hover:border-indigo-500 transition-colors" alt="User" />
                <div className="flex-grow">
                  <p className="text-xs font-bold text-white">{name}</p>
                  <p className="text-[10px] text-slate-500">Left 4 suggestions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
