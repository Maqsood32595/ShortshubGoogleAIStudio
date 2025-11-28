import React from 'react';
import { Feature } from '../types';
import ToggleSwitch from './ToggleSwitch';
import { CogIcon, LinkIcon, ExclamationTriangleIcon } from './Icons';

interface FeatureCardProps {
  feature: Feature;
  dependents: string[];
  onToggle: (id: string) => void;
  onSelect: (feature: Feature) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, dependents, onToggle, onSelect }) => {
  return (
    <div 
        className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col justify-between hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1"
        onClick={() => onSelect(feature)}
        style={{ cursor: 'pointer' }}
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-bold text-white">{feature.name}</h3>
            <span className="text-xs text-gray-500 font-mono">v{feature.version}</span>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ToggleSwitch
              enabled={feature.enabled}
              onChange={() => onToggle(feature.id)}
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-400 h-10">{feature.description}</p>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4 flex justify-between items-center text-xs text-gray-500 flex-wrap gap-x-4 gap-y-2">
         <div className="flex items-center space-x-2">
            <CogIcon className="h-4 w-4" />
            <span className="font-mono">{feature.backend.routes.length} routes</span>
         </div>
         {feature.dependencies.requires.length > 0 && (
             <div className="flex items-center space-x-2">
                <LinkIcon className="h-4 w-4" />
                <span className="font-mono">{feature.dependencies.requires.length} deps</span>
            </div>
         )}
         {dependents.length > 0 && (
            <div 
                className="flex items-center space-x-2 text-yellow-400"
                title={`This feature is a dependency for: ${dependents.join(', ')}`}
            >
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span className="font-mono">Affects {dependents.length}</span>
            </div>
         )}
      </div>
    </div>
  );
};

export default FeatureCard;