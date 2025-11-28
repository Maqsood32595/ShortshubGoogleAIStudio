
import React, { useMemo } from 'react';
import { Feature } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface HeaderProps {
    features: Feature[];
}

export const Header: React.FC<HeaderProps> = ({ features }) => {
    const enabledCount = useMemo(() => features.filter(f => f.enabled).length, [features]);
    const totalCount = features.length;
    
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                        ShortsHub <span className="text-cyan-400">Feature Dashboard</span>
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Visualize and manage your application's feature flags.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-6 w-6 text-green-400" />
                        <span className="font-semibold text-white">{enabledCount} Enabled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <XCircleIcon className="h-6 w-6 text-red-400" />
                        <span className="font-semibold text-white">{totalCount - enabledCount} Disabled</span>
                    </div>
                </div>
            </div>
        </header>
    );
};