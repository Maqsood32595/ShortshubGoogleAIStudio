
import React, { useMemo } from 'react';
import { ComputedFeature } from '../types';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from './Icons';

interface HeaderProps {
    features: ComputedFeature[];
}

export const Header: React.FC<HeaderProps> = ({ features }) => {
    const stats = useMemo(() => {
        return {
            active: features.filter(f => f.status === 'active').length,
            manual: features.filter(f => f.status === 'disabled-manual').length,
            blocked: features.filter(f => f.status === 'disabled-dependency').length,
            total: features.length
        }
    }, [features]);
    
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 sm:p-6 shadow-lg mb-4">
            <div className="flex flex-col lg:flex-row justify-between items-center">
                <div className="mb-4 lg:mb-0 text-center lg:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Feature <span className="text-cyan-400">Dashboard</span>
                    </h1>
                    <p className="mt-1 text-gray-400 text-sm">
                        Manage feature flags and visualize dependencies.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center space-x-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700">
                        <CheckCircleIcon className="h-5 w-5 text-cyan-400" />
                        <span className="font-semibold text-white">{stats.active} Active</span>
                    </div>
                    {stats.blocked > 0 && (
                        <div className="flex items-center space-x-2 bg-orange-900/20 px-3 py-1.5 rounded-lg border border-orange-500/30">
                            <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />
                            <span className="font-semibold text-orange-100">{stats.blocked} Blocked</span>
                        </div>
                    )}
                    {stats.manual > 0 && (
                        <div className="flex items-center space-x-2 bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-500/30">
                            <XCircleIcon className="h-5 w-5 text-red-400" />
                            <span className="font-semibold text-red-100">{stats.manual} Disabled</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
