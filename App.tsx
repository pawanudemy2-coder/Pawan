
import React, { useState, useCallback } from 'react';
import { Project, Notification, FeedbackType, Feedback, Challenge } from './types';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import CreateProjectModal from './components/CreateProjectModal';

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    topic: 'Build a Weather App',
    tutor: 'Prof. Miller',
    deadline: Date.now() + 604800000,
    description: 'Create a responsive weather dashboard using a public API. Focus on clean UI and error handling.',
    submissionsCount: 3
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    challengeId: 'c1',
    title: 'SkyCast Pro',
    description: 'A minimalist weather app with glassmorphism UI.',
    owner: 'Alex Chen',
    status: 'TESTING',
    codeSnippet: '// Alex\'s code\nconst getWeather = () => { /* logic */ }',
    thumbnail: 'https://picsum.photos/seed/weather1/800/400',
    feedbacks: [],
    createdAt: Date.now() - 86400000,
    votes: 12
  },
  {
    id: '2',
    challengeId: 'c1',
    title: 'StormTracker',
    description: 'Real-time storm tracking with interactive maps.',
    owner: 'Sarah J.',
    status: 'TESTING',
    codeSnippet: '// Sarah\'s code\nimport maps from "leaflet";',
    thumbnail: 'https://picsum.photos/seed/weather2/800/400',
    feedbacks: [],
    createdAt: Date.now() - 43200000,
    votes: 8
  }
];

const App: React.FC = () => {
  const [challenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [view, setView] = useState<{ type: 'dashboard' | 'detail' | 'challenge', id?: string }>({ type: 'dashboard' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addNotification = useCallback((message: string, projectId: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      projectId,
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const handleCreateProject = (newProject: any) => {
    const project: Project = {
      ...newProject,
      id: Math.random().toString(36).substr(2, 9),
      challengeId: 'c1', // Defaulting for demo
      feedbacks: [],
      createdAt: Date.now(),
      status: 'DRAFT',
      votes: 0
    };
    setProjects(prev => [project, ...prev]);
    addNotification(`New version uploaded for challenge: ${project.title}`, project.id);
    setIsModalOpen(false);
  };

  const handleAddFeedback = (projectId: string, feedback: Omit<Feedback, 'id' | 'timestamp'>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newFeedback = { ...feedback, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now() };
        return { ...p, feedbacks: [newFeedback, ...p.feedbacks] };
      }
      return p;
    }));
    addNotification(`New feedback on your app version: ${projects.find(p => p.id === projectId)?.title}`, projectId);
  };

  const handleVote = (projectId: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, votes: p.votes + 1 } : p));
  };

  const currentProject = projects.find(p => p.id === view.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        notifications={notifications} 
        onHome={() => setView({ type: 'dashboard' })} 
        onNotificationClick={(id) => setView({ type: 'detail', id })}
        onClearNotifications={() => setNotifications([])}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {view.type === 'dashboard' ? (
          <Dashboard 
            challenges={challenges}
            projects={projects} 
            onSelectProject={(id) => setView({ type: 'detail', id })}
            onCreateNew={() => setIsModalOpen(true)}
          />
        ) : (
          currentProject && (
            <ProjectDetail 
              project={currentProject} 
              onAddFeedback={(f) => handleAddFeedback(currentProject.id, f)}
              onStatusChange={(status) => setProjects(prev => prev.map(p => p.id === currentProject.id ? { ...p, status } : p))}
              onVote={() => handleVote(currentProject.id)}
            />
          )
        )}
      </main>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateProject} 
      />

      <footer className="py-6 text-center text-slate-500 text-sm glass">
        © 2024 DevSync Community • Tutor & Student Ecosystem
      </footer>
    </div>
  );
};

export default App;
