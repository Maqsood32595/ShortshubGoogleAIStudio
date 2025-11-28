import React, { useState } from 'react';
import { featuresData } from './data/features';
import { Feature } from './types';
import AdminDashboard from './components/AdminDashboard';
import UserFacingApp from './components/UserFacingApp';

const App: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>(featuresData);
  const [view, setView] = useState<'admin' | 'user'>('admin');

  const handleToggleFeature = (id: string) => {
    setFeatures(prevFeatures =>
      prevFeatures.map(f =>
        f.id === id ? { ...f, enabled: !f.enabled } : f
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <span className="font-bold text-white">ShortsHub</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setView('admin')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            view === 'admin' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        Admin Dashboard
                    </button>
                    <button
                        onClick={() => setView('user')}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            view === 'user' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        User-Facing App (Live Preview)
                    </button>
                </div>
            </div>
        </div>
      </nav>

      <div className="p-4 sm:p-6 lg:p-8">
        {view === 'admin' ? (
          <AdminDashboard
            features={features}
            onToggleFeature={handleToggleFeature}
          />
        ) : (
          <UserFacingApp features={features} />
        )}
      </div>
    </div>
  );
};

export default App;
