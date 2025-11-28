
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { featuresData } from './data/features';
import { Feature, ComputedFeature } from './types';
import AdminDashboard from './components/AdminDashboard';
import UserFacingApp from './components/UserFacingApp';
import { calculateFeatureStates } from './utils/featureLogic';
import toast, { Toaster } from 'react-hot-toast';

const STORAGE_KEY = 'vibe_coding_history_v1';

const App: React.FC = () => {
  // 1. Initialize State with Persistence (Safe Experimentation across sessions)
  const [history, setHistory] = useState<Feature[][]>(() => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Failed to load history from storage', e);
    }
    return [featuresData];
  });

  const [historyIndex, setHistoryIndex] = useState(() => {
      // If we loaded history, default to the last entry
      try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
               const parsed = JSON.parse(saved);
               return Array.isArray(parsed) ? parsed.length - 1 : 0;
          }
      } catch(e) {}
      return 0;
  });

  const [view, setView] = useState<'admin' | 'user'>('admin');

  // Persist history changes
  useEffect(() => {
      try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (e) {
          console.error('Failed to save state', e);
      }
  }, [history]);

  const currentFeatures = history[historyIndex];

  // 2. Runtime Flexibility: Cascading Logic
  // The complex logic is now delegated to a pure function, making this component cleaner and safer.
  const computedFeatures: ComputedFeature[] = useMemo(() => {
    return calculateFeatureStates(currentFeatures);
  }, [currentFeatures]);

  // Action Handlers
  const handleToggleFeature = useCallback((id: string) => {
    const newFeatures = currentFeatures.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    );
    
    // Add to history, truncate future if we were in the past
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFeatures);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [currentFeatures, history, historyIndex]);

  const handleUndo = () => setHistoryIndex(prev => Math.max(0, prev - 1));
  const handleRedo = () => setHistoryIndex(prev => Math.min(history.length - 1, prev + 1));
  
  const handleReset = () => {
    // Clear storage for a true "Hard Reset"
    localStorage.removeItem(STORAGE_KEY);
    
    const newHistory = [featuresData]; // Reset to code default
    setHistory(newHistory);
    setHistoryIndex(0);
    toast.success('Factory Reset Complete');
  };

  // VIBE CODING: SYNC WITH CODEBASE
  // Solves the "Drift" problem. If dev updates features.ts, this pulls it in.
  const handleSyncWithCode = () => {
    const newHistory = [...history.slice(0, historyIndex + 1), featuresData];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    toast.success('Synced with features.ts');
  };

  // VIBE CODING: EXPORT STATE
  // Allows handing over the exact state to an AI
  const handleExportState = () => {
    const json = JSON.stringify(currentFeatures, null, 2);
    navigator.clipboard.writeText(json);
    toast.success('Config copied to clipboard! Paste this to your AI.');
  };

  // VIBE CODING: IMPORT STATE
  // Allows pasting a fix from an AI back into the app
  const handleImportState = (jsonString: string) => {
      try {
          const importedFeatures = JSON.parse(jsonString);
          if (!Array.isArray(importedFeatures)) throw new Error("Invalid format");
          
          // Basic validation
          if (!importedFeatures[0].id || !importedFeatures[0].backend) {
               throw new Error("JSON missing required feature fields");
          }

          const newHistory = [...history.slice(0, historyIndex + 1), importedFeatures];
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
          toast.success('State imported successfully');
      } catch (e) {
          toast.error('Failed to import: Invalid JSON');
          console.error(e);
      }
  };

  // Keyboard shortcuts for power users/AI speed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, historyIndex]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#374151', color: '#fff' } }} />
      
      <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <span className="font-bold text-white text-xl">ShortsHub <span className="text-cyan-500 text-xs uppercase tracking-widest ml-2">DevOps</span></span>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setView('admin')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            view === 'admin' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        Admin Dashboard
                    </button>
                    <button
                        onClick={() => setView('user')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            view === 'user' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        Live Preview
                    </button>
                </div>
            </div>
        </div>
      </nav>

      <div className="p-4 sm:p-6 lg:p-8">
        {view === 'admin' ? (
          <AdminDashboard
            features={computedFeatures}
            onToggleFeature={handleToggleFeature}
            historyState={{
              canUndo: historyIndex > 0,
              canRedo: historyIndex < history.length - 1,
              onUndo: handleUndo,
              onRedo: handleRedo,
              onReset: handleReset
            }}
            portabilityState={{
                onSync: handleSyncWithCode,
                onExport: handleExportState,
                onImport: handleImportState
            }}
          />
        ) : (
          <UserFacingApp features={computedFeatures} />
        )}
      </div>
    </div>
  );
};

export default App;
