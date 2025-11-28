
import React from 'react';
import { Feature, Route } from '../types';
import { XIcon, LinkIcon, ShieldCheckIcon, ChartBarIcon, CogIcon, HeartIcon } from './Icons';

interface FeatureDetailModalProps {
  feature: Feature | null;
  onClose: () => void;
}

const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mt-6">
        <div className="flex items-center mb-3">
            {icon}
            <h4 className="text-lg font-semibold text-gray-200 ml-2">{title}</h4>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700 text-sm">
            {children}
        </div>
    </div>
);

const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({ feature, onClose }) => {
  if (!feature) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 sticky top-0 bg-gray-800 z-10 border-b border-gray-700">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">{feature.name}</h2>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <XIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="mt-4 flex items-center space-x-4 text-xs font-mono">
                <span className={`px-2 py-1 rounded-full ${feature.enabled ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {feature.enabled ? 'ENABLED' : 'DISABLED'}
                </span>
                <span>Version: {feature.version}</span>
                {feature.fallback && <span>Fallback: {feature.fallback}</span>}
            </div>
        </div>

        <div className="p-6">
            <DetailSection title="Backend Routes" icon={<CogIcon className="w-5 h-5 text-cyan-400" />}>
                <ul className="space-y-2">
                    {feature.backend.routes.map((route: Route, index: number) => (
                        <li key={index} className="font-mono text-gray-300 flex items-center space-x-3">
                            <span className={`text-xs font-bold w-12 text-center py-0.5 rounded ${
                                route.method === 'GET' ? 'bg-blue-500/20 text-blue-300' :
                                route.method === 'POST' ? 'bg-green-500/20 text-green-300' :
                                route.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-300' :
                                route.method === 'DELETE' ? 'bg-red-500/20 text-red-300' :
                                'bg-gray-500/20 text-gray-300'
                            }`}>{route.method}</span>
                            <span className="flex-1 text-gray-400">{route.path}</span>
                            <span>→</span>
                            <span className="text-cyan-400">{route.handler}</span>
                        </li>
                    ))}
                </ul>
            </DetailSection>

            {Object.keys(feature.config).length > 0 && (
                <DetailSection title="Configuration" icon={<CogIcon className="w-5 h-5 text-cyan-400" />}>
                    <pre className="text-gray-300 text-xs overflow-x-auto p-0">{JSON.stringify(feature.config, null, 2)}</pre>
                </DetailSection>
            )}

            <DetailSection title="Health Check" icon={<HeartIcon className="w-5 h-5 text-cyan-400" />}>
                <pre className="text-gray-300 text-xs overflow-x-auto p-0">{JSON.stringify(feature.health, null, 2)}</pre>
            </DetailSection>

            {feature.dependencies.requires.length > 0 && (
                <DetailSection title="Dependencies" icon={<LinkIcon className="w-5 h-5 text-cyan-400" />}>
                    <div className="flex flex-wrap gap-2">
                        {feature.dependencies.requires.map(dep => (
                            <span key={dep} className="font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">{dep}</span>
                        ))}
                    </div>
                </DetailSection>
            )}

            {feature.security?.rateLimit && (
                 <DetailSection title="Security" icon={<ShieldCheckIcon className="w-5 h-5 text-cyan-400" />}>
                     <pre className="text-gray-300 text-xs overflow-x-auto p-0">{JSON.stringify(feature.security, null, 2)}</pre>
                 </DetailSection>
            )}

            {feature.monitoring?.metrics && (
                <DetailSection title="Monitoring" icon={<ChartBarIcon className="w-5 h-5 text-cyan-400" />}>
                    <div className="flex flex-wrap gap-2">
                        {feature.monitoring.metrics.map(metric => (
                            <span key={metric} className="font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">{metric}</span>
                        ))}
                    </div>
                </DetailSection>
            )}
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailModal;