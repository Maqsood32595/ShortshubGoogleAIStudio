
import React, { useState } from 'react';
import { XIcon } from './Icons';

interface ImportModalProps {
    onClose: () => void;
    onImport: (json: string) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport }) => {
    const [input, setInput] = useState('');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Import State from AI</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                    Paste the JSON configuration provided by your AI assistant below to apply fixes or experimental states.
                </p>
                <textarea 
                    className="w-full h-48 bg-gray-900 border border-gray-600 rounded-md p-3 text-xs font-mono text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    placeholder='[ { "id": "user-auth", ... } ]'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="mt-6 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onImport(input)}
                        disabled={!input.trim()}
                        className="px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-md shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Apply State
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
