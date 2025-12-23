
import React from 'react';
import { Feedback, FeedbackType } from '../types';

interface FeedbackListProps {
  feedbacks: Feedback[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
  if (feedbacks.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 italic">No feedback yet. Be the first to test it!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedbacks.map(f => (
        <div key={f.id} className="flex gap-4 group">
          <img src={`https://picsum.photos/seed/${f.author}/40`} className="w-10 h-10 rounded-full flex-shrink-0" alt={f.author} />
          <div className="flex-grow bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 group-hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-white">{f.author}</span>
              <span className="text-[10px] text-slate-500">{new Date(f.timestamp).toLocaleString()}</span>
            </div>
            
            {f.type === FeedbackType.TEXT && (
              <p className="text-sm text-slate-300 leading-relaxed">{f.content}</p>
            )}

            {f.type === FeedbackType.IMAGE && (
              <div className="space-y-2">
                <img src={f.content} className="max-w-full rounded-lg border border-slate-700" alt="Feedback attachment" />
                <p className="text-xs text-slate-400 italic">Visual capture of the issue</p>
              </div>
            )}

            {f.type === FeedbackType.VIDEO && (
              <div className="space-y-2">
                <video src={f.content} controls className="max-w-full rounded-lg border border-slate-700" />
                <p className="text-xs text-slate-400 italic">Screen recording submission</p>
              </div>
            )}

            {f.type === FeedbackType.VOICE && (
              <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-grow h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-indigo-400" />
                </div>
                <span className="text-[10px] text-slate-500">0:12</span>
              </div>
            )}

            <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <button className="hover:text-indigo-400 flex items-center gap-1 transition-colors">
                Reply
              </button>
              <button className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
