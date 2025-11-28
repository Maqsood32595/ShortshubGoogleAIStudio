
import React, { useState, useMemo } from 'react';
import { ComputedFeature } from '../types';
import FeatureCard from './FeatureCard';
import FeatureDetailModal from './FeatureDetailModal';
import DependencyGraph from './DependencyGraph';
import { Header } from './Header';
import ImportModal from './ImportModal';
import { CogIcon } from './Icons';

interface AdminDashboardProps {
    features: ComputedFeature[];
    onToggleFeature: (id: string) => void;
    historyState: {
        canUndo: boolean;
        canRedo: boolean;
        onUndo: () => void;
        onRedo: () => void;
        onReset: () => void;
    };
    portabilityState: {
        onSync: () => void;
        onExport: () => void;
        onImport: (json: string) => void;
    }
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ features, onToggleFeature, historyState, portabilityState }) => {
  const [selectedFeature, setSelectedFeature] = useState<ComputedFeature | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleSelectFeature = (feature: ComputedFeature) => {
    setSelectedFeature(feature);
  };

  const handleCloseModal = () => {
    setSelectedFeature(null);
  };

  const filteredFeatures = useMemo(() => {
    return features.filter(feature =>
      feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [features, searchTerm]);

  const dependentsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    features.forEach(feature => {
        feature.dependencies.requires.forEach(depId => {
            if (!map.has(depId)) {
                map.set(depId, []);
            }
            map.get(depId)!.push(feature.id);
        });
    });
    return map;
  }, [features]);

  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
                 <Header features={features} />
            </div>
            
            {/* Vibe Coding Control Panel */}
            <div className="flex flex-col gap-4 min-w-[240px]">
                
                {/* Safety Controls */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Time Travel</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={historyState.onUndo} 
                            disabled={!historyState.canUndo}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm py-2 px-3 rounded transition-colors"
                            title="Undo (Ctrl+Z)"
                        >
                            Undo
                        </button>
                        <button 
                            onClick={historyState.onRedo} 
                            disabled={!historyState.canRedo}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm py-2 px-3 rounded transition-colors"
                            title="Redo (Ctrl+Shift+Z)"
                        >
                            Redo
                        </button>
                    </div>
                    <button 
                        onClick={historyState.onReset}
                        className="mt-2 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm py-2 px-3 rounded border border-red-500/20 transition-colors"
                    >
                        Factory Reset
                    </button>
                </div>

                {/* Portability Controls */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">AI Handover</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={portabilityState.onExport}
                            className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs py-2 px-2 rounded border border-indigo-500/30 transition-colors"
                        >
                            Copy State
                        </button>
                        <button 
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs py-2 px-2 rounded border border-indigo-500/30 transition-colors"
                        >
                            Paste State
                        </button>
                    </div>
                    <button 
                        onClick={portabilityState.onSync}
                        className="mt-2 w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs py-2 px-3 rounded border border-emerald-500/20 transition-colors flex items-center justify-center gap-2"
                        title="Discard local changes and load from features.ts"
                    >
                        <CogIcon className="w-3 h-3" />
                        Sync with Codebase
                    </button>
                </div>

            </div>
        </div>

        <main>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-8 shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Feature Topology</h2>
                         <p className="text-gray-400 text-sm sm:text-base mt-1">
                            Visualizing cascading dependencies. <span className="text-red-400">Red</span> nodes are manually off. <span className="text-orange-400">Orange</span> nodes are blocked by dependencies.
                        </p>
                    </div>
                </div>
                <DependencyGraph features={features} onNodeClick={handleSelectFeature} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Feature Flags</h2>
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search features..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map(feature => {
                const dependents = dependentsMap.get(feature.id) || [];
                return (
                <FeatureCard
                    key={feature.id}
                    feature={feature}
                    dependents={dependents}
                    onToggle={onToggleFeature}
                    onSelect={handleSelectFeature}
                />
                );
            })}
            </div>
        </main>
        
        <FeatureDetailModal
            feature={selectedFeature}
            onClose={handleCloseModal}
        />

        {isImportModalOpen && (
            <ImportModal 
                onClose={() => setIsImportModalOpen(false)} 
                onImport={(json) => {
                    portabilityState.onImport(json);
                    setIsImportModalOpen(false);
                }} 
            />
        )}
    </div>
  );
};

export default AdminDashboard;
