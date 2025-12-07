import React from 'react';
import { useGame } from '../context/GameContext';

const PitchModal = () => {
    const { 
        activePitchIndex, 
        prospects, 
        currentPitchOptions, 
        resolvePitch, 
        closePitchModal 
    } = useGame();

    if (activePitchIndex === null) return null;

    const prospect = prospects[activePitchIndex];
    if (!prospect) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-slate-200 mt-0 mb-4">Pitching Service</h2>
                
                <div className="bg-slate-800/50 p-4 rounded-lg mb-6 border border-slate-700">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                        Prospect
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg font-bold text-slate-200">{prospect.name}</div>
                        {prospect.rarity && (
                            <span className={`text-xs px-2 py-1 rounded font-bold ${
                                prospect.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                                prospect.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-blue-500/20 text-blue-400'
                            }`}>
                                {prospect.rarity === 'legendary' ? 'Legendary' :
                                 prospect.rarity === 'epic' ? 'Epic' : 'Rare'}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Looking for:</span>
                        <span className="bg-indigo-500/20 text-indigo-400 font-bold text-sm px-3 py-1 rounded border border-indigo-500/50">
                            {prospect.taste}
                        </span>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                        Contract Length: <span className="font-bold text-slate-200">{prospect.contractDays} Days</span>
                    </div>
                    {prospect.requiresPreparation && (
                        <div className="mt-2 text-xs text-orange-400">
                            ⚠️ This producer requires preparation time
                        </div>
                    )}
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    Select the buzzword that best sells your service to this client's specific taste.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {currentPitchOptions.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => resolvePitch(option.valid)}
                            className="bg-slate-800 border-2 border-slate-700 hover:border-indigo-500 hover:bg-slate-700 hover:text-indigo-400 text-slate-300 font-semibold py-4 px-4 rounded-lg transition-all"
                        >
                            {option.text}
                        </button>
                    ))}
                </div>

                <button
                    onClick={closePitchModal}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-lg transition-all border border-slate-700"
                >
                    Cancel Pitch
                </button>
            </div>
        </div>
    );
};

export default PitchModal;
