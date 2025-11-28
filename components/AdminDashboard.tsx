import React, { useState, useMemo } from 'react';
import { Feature } from '../types';
import FeatureCard from './FeatureCard';
import FeatureDetailModal from './FeatureDetailModal';
import DependencyGraph from './DependencyGraph';
import { Header } from './Header';

interface AdminDashboardProps {
    features: Feature[];
    onToggleFeature: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ features, onToggleFeature }) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectFeature = (feature: Feature) => {
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
        <Header features={features} />

        <main className="mt-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 mb-8 shadow-2xl">
                <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4">Feature Dependency Graph</h2>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                    This graph illustrates the relationships between features. A line from feature A to B means A depends on B.
                </p>
                <DependencyGraph features={features} onNodeClick={handleSelectFeature} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">All Features</h2>
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
    </div>
  );
};

export default AdminDashboard;
