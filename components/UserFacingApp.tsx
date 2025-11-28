
import React, { useMemo, useState } from 'react';
import { ComputedFeature } from '../types';
import { ChartBarIcon, CogIcon, XCircleIcon, ExclamationTriangleIcon } from './Icons';

interface UserFacingAppProps {
    features: ComputedFeature[];
}

const FeatureDisplay: React.FC<{ name: string, description: string, children: React.ReactNode }> = ({ name, description, children }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-start transition-all hover:border-gray-600">
        <h3 className="text-lg font-bold text-cyan-400">{name}</h3>
        <p className="text-sm text-gray-400 mt-1 mb-4">{description}</p>
        <div className="flex items-center space-x-4 w-full">
            {children}
        </div>
    </div>
);

const UserFacingApp: React.FC<UserFacingAppProps> = ({ features }) => {
    const [prompt, setPrompt] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const featureMap = useMemo(() => {
        return new Map(features.map(f => [f.id, f]));
    }, [features]);

    const isActive = (id: string) => featureMap.get(id)?.status === 'active';
    const isBlocked = (id: string) => featureMap.get(id)?.status === 'disabled-dependency';

    const handleOptimize = () => {
        if (!prompt) {
            setSuggestions([]);
            return;
        };
        setSuggestions([
            `An epic cinematic shot of "${prompt}", golden hour lighting, hyperrealistic, 8k.`,
            `A whimsical, animated version of "${prompt}", Studio Ghibli style, vibrant colors.`,
            `Dark, moody, noir-style scene of "${prompt}", heavy shadows, rain-slicked streets.`,
        ]);
    };

    const RenderStatusMessage = ({ id }: { id: string }) => {
        const feature = featureMap.get(id);
        if (feature?.status === 'disabled-dependency') {
            return (
                <div className="flex items-center space-x-2 text-orange-400 text-sm bg-orange-900/20 px-3 py-2 rounded w-full">
                    <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0"/>
                    <span>Unavailable: Dependency <strong>{feature.blockedBy?.[0]}</strong> is offline.</span>
                </div>
            );
        }
        if (feature?.status === 'disabled-manual') {
            return (
                <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded w-full">
                    <XCircleIcon className="w-5 h-5 flex-shrink-0"/>
                    <span>Feature is currently disabled by administrator.</span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white">Welcome to ShortsHub</h1>
                <p className="text-lg text-gray-400 mt-2">Your all-in-one platform for creating and sharing short videos.</p>
                <div className="mt-4 inline-block px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-500 font-mono border border-gray-700">
                    Live Environment Preview
                </div>
            </header>
            
            <div className="space-y-8">
                <FeatureDisplay name="AI Video Generation" description="Create stunning videos from text prompts.">
                    <div className="w-full">
                        {isActive('ai-generation') ? (
                            <button className="bg-cyan-500 text-white font-bold py-2 px-4 rounded hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20">
                                Generate with AI
                            </button>
                        ) : (
                            <RenderStatusMessage id="ai-generation" />
                        )}
                        
                        {isActive('ai-generation') && isActive('ai-generation-sora') && (
                            <p className="text-xs text-green-400 mt-2 flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                                Sora fallback system ready
                            </p>
                        )}

                        {isActive('prompt-optimizer') && (
                            <div className="mt-4 border-t border-gray-700 pt-4 w-full">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Enhance your idea:</h4>
                                <textarea
                                    className="w-full bg-gray-700 rounded-md p-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none border border-transparent focus:border-cyan-500 transition-all"
                                    placeholder="Enter a simple prompt to optimize..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <button
                                    onClick={handleOptimize}
                                    className="mt-2 bg-indigo-500 text-white font-bold py-1 px-3 rounded text-sm hover:bg-indigo-600 transition-colors"
                                >
                                    Optimize Prompt
                                </button>
                                {suggestions.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <h5 className="text-xs font-bold text-gray-400">Choose a suggestion:</h5>
                                        {suggestions.map((s, i) => (
                                            <div key={i} className="bg-gray-700/50 p-2 rounded-md text-xs text-gray-300 cursor-pointer hover:bg-gray-600 border border-gray-600/50">
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </FeatureDisplay>

                <FeatureDisplay name="Content Publishing" description="Share your creations on social media.">
                    {isActive('social-publishing') ? (
                         <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                            Publish to Socials
                         </button>
                    ) : (
                        <RenderStatusMessage id="social-publishing" />
                    )}
                </FeatureDisplay>

                <FeatureDisplay name="Analytics" description="Track the performance of your videos.">
                     {isActive('analytics-dashboard') ? (
                        <a href="#" className="text-cyan-400 hover:underline flex items-center space-x-2 group">
                           <ChartBarIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                           <span>View Analytics Dashboard</span>
                        </a>
                     ) : (
                        <div className="w-full">
                           <RenderStatusMessage id="analytics-dashboard" />
                        </div>
                     )}
                </FeatureDisplay>
                
                <FeatureDisplay name="Account Settings" description="Manage your profile and preferences.">
                     {isActive('user-settings') ? (
                        <a href="#" className="text-gray-300 hover:text-white flex items-center space-x-2 group">
                            <CogIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500"/>
                           <span>Go to Settings</span>
                        </a>
                     ) : (
                         <div className="w-full">
                           <RenderStatusMessage id="user-settings" />
                        </div>
                     )}
                </FeatureDisplay>

            </div>
        </div>
    );
};

export default UserFacingApp;
