
import React from 'react';
import { ComputedFeature } from '../types';
import ToggleSwitch from './ToggleSwitch';
import { CogIcon, LinkIcon, ExclamationTriangleIcon } from './Icons';

interface FeatureCardProps {
  feature: ComputedFeature;
  dependents: string[];
  onToggle: (id: string) => void;
  onSelect: (feature: ComputedFeature) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, dependents, onToggle, onSelect }) => {
  // Visual logic for different states
  const isBlocked = feature.status === 'disabled-dependency';
  const isManualOff = feature.status === 'disabled-manual';
  const isActive = feature.status === 'active';

  let statusColor = "border-gray-700";
  if (isActive) statusColor = "hover:border-cyan-500 hover:shadow-cyan-500/10";
  if (isManualOff) statusColor = "border-gray-700 opacity-75 grayscale-[0.5]";
  if (isBlocked) statusColor = "border-orange-500/50 bg-orange-900/10";

  return (
    <div 
        className={`bg-gray-800 border rounded-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${statusColor}`}
        onClick={() => onSelect(feature)}
        style={{ cursor: 'pointer' }}
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className={`text-lg font-bold ${isBlocked ? 'text-orange-300' : 'text-white'}`}>
                {feature.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500 font-mono">v{feature.version}</span>
                {isBlocked && (
                    <span className="text-xs bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded font-mono uppercase tracking-tight">
                        Blocked
                    </span>
                )}
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ToggleSwitch
              enabled={feature.enabled}
              onChange={() => onToggle(feature.id)}
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-400 h-10 line-clamp-2">{feature.description}</p>

        {isBlocked && feature.blockedBy && feature.blockedBy.length > 0 && (
            <div className="mt-2 text-xs text-orange-400 flex items-center bg-orange-900/20 p-2 rounded">
                <ExclamationTriangleIcon className="h-3 w-3 mr-1.5" />
                Blocked by: {feature.blockedBy.join(', ')}
            </div>
        )}
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
