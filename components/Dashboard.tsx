
import React, { useState } from 'react';
import { Project, Challenge } from '../types';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  challenges: Challenge[];
  projects: Project[];
  onSelectProject: (id: string) => void;
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ challenges, projects, onSelectProject, onCreateNew }) => {
  const [rankingResult, setRankingResult] = useState<string | null>(null);
  const [isRanking, setIsRanking] = useState(false);

  const handleAIRank = async (challengeTopic: string) => {
    setIsRanking(true);
    const submissions = projects.filter(p => p.challengeId === 'c1').map(p => ({
      owner: p.owner,
      code: p.codeSnippet,
      desc: p.description
    }));
    
    try {
      const result = await geminiService.rankSubmissions(challengeTopic, submissions);
      setRankingResult(result);
    } catch (e) {
      setRankingResult("Ranking failed. Please check API configuration.");
    } finally {
      setIsRanking(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-12">
      {/* Active Challenges Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-500 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
              Tutor Assignments
            </h2>
            <p className="text-slate-400 text-sm mt-1">Current topics for the community to develop.</p>
          </div>
        </div>

        {challenges.map(challenge => (
          <div key={challenge.id} className="glass rounded-3xl p-8 border-indigo-500/20 shadow-2xl bg-gradient-to-br from-slate-800/50 to-indigo-900/10">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-grow max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold px-3 py-1 bg-indigo-500 text-white rounded-full uppercase tracking-tighter">Active Challenge</span>
                  <span className="text-xs text-slate-500">Assigned by {challenge.tutor}</span>
                </div>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tight">{challenge.topic}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{challenge.description}</p>
                
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={onCreateNew}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
                  >
                    Submit My Version
                  </button>
                  <button 
                    onClick={() => handleAIRank(challenge.topic)}
                    disabled={isRanking}
                    className="bg-slate-800 hover:bg-slate-700 text-indigo-400 px-6 py-3 rounded-2xl font-bold border border-slate-700 flex items-center gap-2 transition-all"
                  >
                    {isRanking ? 'Analyzing...' : 'AI Leaderboard Analysis'}
                  </button>
                </div>
              </div>

              <div className="lg:w-80 flex flex-col gap-4">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-2">Submissions</p>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-black text-white">{projects.length}</span>
                    <span className="text-xs text-emerald-500">+2 today</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-2">Deadline</p>
                  <span className="text-lg font-bold text-amber-500">4 Days Remaining</span>
                </div>
              </div>
            </div>

            {rankingResult && (
              <div className="mt-8 p-6 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">AI</div>
                  <h4 className="font-bold text-white">Gemini Tech Verdict & Ranking</h4>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line">
                  {rankingResult}
                </div>
                <button 
                  onClick={() => setRankingResult(null)}
                  className="mt-6 text-xs text-slate-500 hover:text-white"
                >
                  Hide Analysis
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Version List Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Student Submissions</h2>
          <div className="flex gap-2">
            <button className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 font-medium">Newest</button>
            <button className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full font-bold">Top Voted</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="group glass rounded-2xl overflow-hidden hover:ring-2 hover:ring-indigo-500/50 transition-all cursor-pointer flex flex-col relative"
            >
              <div className="relative h-48">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                   <span className="bg-slate-900/80 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10">
                    v1.0.4
                   </span>
                </div>
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a2 2 0 00-.8 1.6V10.333z" />
                    </svg>
                    {project.votes}
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <img src={`https://picsum.photos/seed/${project.owner}/20`} className="w-5 h-5 rounded-full" alt="Dev" />
                  <span className="text-xs text-slate-400">By {project.owner}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm mt-2 line-clamp-2">{project.description}</p>
              </div>
              
              <div className="px-5 py-3 bg-slate-800/30 flex justify-between items-center border-t border-white/5">
                <span className="text-[10px] text-slate-500">{project.feedbacks.length} Reviews</span>
                <span className="text-[10px] text-slate-500">Tested by 14 people</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
