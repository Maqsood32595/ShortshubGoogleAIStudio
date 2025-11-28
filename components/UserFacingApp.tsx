import React, { useMemo, useState } from 'react';
import { Feature } from '../types';
import { ChartBarIcon, CogIcon, LinkIcon, XCircleIcon } from './Icons';

interface UserFacingAppProps {
    features: Feature[];
}

const FeatureDisplay: React.FC<{ name: string, description: string, children: React.ReactNode }> = ({ name, description, children }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col items-start">
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

    const enabledFeatures = useMemo(() => {
        const enabled = new Map<string, boolean>();
        features.forEach(f => enabled.set(f.id, f.enabled));
        return enabled;
    }, [features]);

    const isEnabled = (id: string) => !!enabledFeatures.get(id);

    const handleOptimize = () => {
        // Simulate API call
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

    return (
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white">Welcome to ShortsHub</h1>
                <p className="text-lg text-gray-400 mt-2">Your all-in-one platform for creating and sharing short videos.</p>
            </header>
            
            <div className="space-y-8">
                <FeatureDisplay name="AI Video Generation" description="Create stunning videos from text prompts.">
                    <div className="w-full">
                        {isEnabled('ai-generation') ? (
                            <button className="bg-cyan-500 text-white font-bold py-2 px-4 rounded hover:bg-cyan-600 transition-colors">
                                Generate with AI
                            </button>
                        ) : (
                            <button className="bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded cursor-not-allowed" disabled>
                                AI Generation (Temporarily Unavailable)
                            </button>
                        )}
                        {isEnabled('ai-generation') && isEnabled('ai-generation-sora') && (
                            <p className="text-xs text-gray-500 mt-2">Sora fallback is ready.</p>
                        )}

                        {isEnabled('prompt-optimizer') && (
                            <div className="mt-4 border-t border-gray-700 pt-4 w-full">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Enhance your idea:</h4>
                                <textarea
                                    className="w-full bg-gray-700 rounded-md p-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
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
                                            <div key={i} className="bg-gray-700/50 p-2 rounded-md text-xs text-gray-300 cursor-pointer hover:bg-gray-600">
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
                    {isEnabled('social-publishing') ? (
                         <button className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors">
                            Publish to Socials
                         </button>
                    ) : (
                        <div className="flex items-center space-x-2 text-red-400">
                           <XCircleIcon className="w-5 h-5"/>
                           <span>Publishing is currently disabled.</span>
                        </div>
                    )}
                </FeatureDisplay>

                <FeatureDisplay name="Analytics" description="Track the performance of your videos.">
                     {isEnabled('analytics-dashboard') ? (
                        <a href="#" className="text-cyan-400 hover:underline flex items-center space-x-2">
                           <ChartBarIcon className="w-5 h-5" />
                           <span>View Analytics Dashboard</span>
                        </a>
                     ) : (
                        <p className="text-gray-500 text-sm">Analytics are not available at this time.</p>
                     )}
                </FeatureDisplay>
                
                <FeatureDisplay name="Account Settings" description="Manage your profile and preferences.">
                     {isEnabled('user-settings') ? (
                        <a href="#" className="text-gray-300 hover:text-white flex items-center space-x-2">
                            <CogIcon className="w-5 h-5"/>
                           <span>Go to Settings</span>
                        </a>
                     ) : (
                        <p className="text-gray-500 text-sm">Account settings are currently unavailable.</p>
                     )}
                </FeatureDisplay>

            </div>
        </div>
    );
};

export default UserFacingApp;